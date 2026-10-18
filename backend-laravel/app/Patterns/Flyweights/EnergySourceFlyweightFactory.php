<?php

namespace App\Patterns\Flyweights;

use App\Patterns\EnergySources\EnergySource;
use App\Patterns\Factories\EnergySourceFactory;

/**
 * Patron Flyweight.
 *
 * Comparte UNA SOLA instancia de EnergySource por cada tipo de energia
 * (solar, wind, hydro). El estado intrinseco (nombre, descripcion,
 * eficiencia y color del tipo) vive en el flyweight y es el mismo para
 * todas las ofertas; el estado extrinseco (productor, kWh, precio,
 * fecha) vive fuera, en cada EnergyOffer.
 *
 * De esta forma, cientos de ofertas reutilizan 3 instancias en lugar de
 * instanciar un descriptor nuevo por cada consulta.
 */
class EnergySourceFlyweightFactory
{
    private static ?EnergySourceFlyweightFactory $instance = null;

    /** @var array<string, EnergySource> Pool de flyweights compartidos por tipo. */
    private array $pool = [];

    private string $dataFile;

    /** @var array{createdInstances:int,totalUses:int,usesByType:array<string,int>} */
    private array $metrics = [
        'createdInstances' => 0,
        'totalUses' => 0,
        'usesByType' => [],
    ];

    private function __construct()
    {
        $this->dataFile = storage_path('app/flyweight_data.json');
        $this->load();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $data = json_decode(file_get_contents($this->dataFile), true) ?? [];
            $this->metrics = array_merge($this->metrics, $data['metrics'] ?? []);
        }
    }

    private function save(): void
    {
        file_put_contents($this->dataFile, json_encode(
            ['metrics' => $this->metrics],
            JSON_PRETTY_PRINT
        ));
    }

    /**
     * Devuelve el flyweight COMPARTIDO del tipo pedido.
     * En un cache miss delega la creacion en el Factory Method
     * (EnergySourceFactory) una UNICA vez por tipo.
     */
    public function get(string $type): EnergySource
    {
        $key = strtolower(trim($type));

        if (!isset($this->pool[$key])) {
            // Cache miss: la fabrica crea el flyweight una sola vez.
            $this->pool[$key] = (new EnergySourceFactory())->create($key);
            $this->metrics['createdInstances']++;
        }

        // Cache hit: se reutiliza la instancia compartida.
        $this->metrics['totalUses']++;
        $this->metrics['usesByType'][$key] = ($this->metrics['usesByType'][$key] ?? 0) + 1;
        $this->save();

        return $this->pool[$key];
    }

    /** Estado compartido del tipo, listo para enriquecer una oferta. */
    public function describe(string $type): array
    {
        return $this->get($type)->toArray();
    }

    /** Metricas del pool: instancias creadas vs. usos acumulados. */
    public function getStats(): array
    {
        return [
            'createdInstances' => $this->metrics['createdInstances'],
            'totalUses' => $this->metrics['totalUses'],
            'usesByType' => $this->metrics['usesByType'],
            'sharedTypes' => array_values(array_map(
                fn (EnergySource $source) => [
                    'type' => $source->getType(),
                    'name' => $source->getName(),
                    'color' => $source->getColor(),
                ],
                $this->pool
            )),
            'note' => 'Sin Flyweight, cada consulta instanciaria un descriptor nuevo por oferta. '
                . 'Con Flyweight, N usos reutilizan una sola instancia por tipo.',
        ];
    }
}
