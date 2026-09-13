<?php

namespace App\Patterns\Prototypes;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;
use App\Patterns\Factories\EnergySourceFactory;

class PrototypeRegistry
{
    private static ?PrototypeRegistry $instance = null;

    private array $templates = [];

    private function __construct()
    {
        $this->seedTemplates();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function seedTemplates(): void
    {
        $defaultPrice = (float) ConfigService::getInstance()->get('defaultPricePerKwh');

        // Usa el Factory Method para crear una plantilla base por tipo de energia.
        foreach (EnergySourceFactory::TYPES as $type) {
            $source = (new EnergySourceFactory())->create($type);

            $template = new EnergyOffer();
            $template->producerName = '';
            $template->totalKwh = 20;
            $template->availableKwh = 20;
            $template->pricePerKwh = $defaultPrice;
            $template->description = "Plantilla de oferta {$source->getName()}. Al clonarla se crea una copia independiente de este prototipo.";
            $template->energyType = $source->getType();

            $this->templates[$type] = new OfferPrototype($template);
        }
    }

    public function getTemplate(string $type): OfferPrototype
    {
        $key = strtolower($type);
        if (!isset($this->templates[$key])) {
            throw new \InvalidArgumentException("No existe plantilla para el tipo: {$type}");
        }

        // Devuelve una CLON del prototipo almacenado (no el prototipo original).
        return $this->templates[$key]->copy();
    }

    public function listTemplates(): array
    {
        return array_values(array_map(
            fn(OfferPrototype $template) => $template->getOffer()->toArray(),
            $this->templates
        ));
    }
}