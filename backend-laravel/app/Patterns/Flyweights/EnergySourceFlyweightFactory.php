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
 * instanciar un descriptor nuevo por cada oferta.
 */
class EnergySourceFlyweightFactory
{
    private static ?EnergySourceFlyweightFactory $instance = null;

    /** @var array<string, EnergySource> Pool de flyweights canonicos por tipo. */
    private array $pool = [];

    private string $dataFile;

    /** @var array{totalUses:int,usesByType:array<string,int>} */
    private array $metrics = [
        'totalUses' => 0,
        'usesByType' => [],
    ];

    private function __construct()
    {
        $this->dataFile = storage_path('app/flyweight_data.json');
        $this->load();
        $this->seedPool();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Crea los flyweights canonicos UNA vez apoyandose en el Factory Method
     * (EnergySourceFactory). A partir de aqui siempre se comparten.
     */
    private function seedPool(): void
    {
        foreach (EnergySourceFactory::TYPES as $type) {
            if (!isset($this->pool[$type])) {
                $this->pool[$type] = (new EnergySourceFactory())->create($type);
            }
        }
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
     * Devuelve el flyweight COMPARTIDO del tipo pedido. Si el tipo no
     * pertenece al catalogo base se delega en el Factory Method.
     */
    public function get(string $type): EnergySource
    {
        $key = strtolower(trim($type));

        if (!isset($this->pool[$key])) {
            // Tipo fuera del catalogo base: se crea y se comparte tambien.
            $this->pool[$key] = (new EnergySourceFactory())->create($key);
        }

        // Cada uso reutiliza la MISMA instancia (cache hit del pool).
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

    /** Metricas del pool: instancias compartidas vs. usos acumulados. */
    public function getStats(): array
    {
        $shared = count($this->pool);

        return [
            'createdInstances' => $shared,
            'totalUses' => $this->metrics['totalUses'],
            'savedInstances' => max(0, $this->metrics['totalUses'] - $shared),
            'usesByType' => $this->metrics['usesByType'],
            'sharedTypes' => array_values(array_map(
                fn (EnergySource $source) => [
                    'type' => $source->getType(),
                    'name' => $source->getName(),
                    'color' => $source->getColor(),
                ],
                $this->pool
            )),
            'note' => 'Sin Flyweight, cada uso crearia una instancia nueva (1 por oferta/consulta). '
                . 'Con Flyweight, todos los usos comparten las mismas instancias del pool (una por tipo).',
        ];
    }
}
