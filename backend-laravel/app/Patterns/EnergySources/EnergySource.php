<?php

namespace App\Patterns\EnergySources;

use App\Patterns\Visitors\MarketElementVisitor;

abstract class EnergySource
{
    abstract public function getType(): string;

    abstract public function getName(): string;

    abstract public function getDescription(): string;

    abstract public function getEfficiency(): int;

    abstract public function getColor(): string;

    public function toArray(): array
    {
        return [
            'type' => $this->getType(),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'efficiency' => $this->getEfficiency(),
            'color' => $this->getColor(),
        ];
    }

    /**
     * Patron Visitor — acepta un visitante (doble despacho): la fuente
     * concreta delega en el método visit que le corresponde por clase.
     */
    public function accept(MarketElementVisitor $visitor): void
    {
        $visitor->visitSource($this);
    }
}
