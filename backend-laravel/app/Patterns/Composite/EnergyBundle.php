<?php

namespace App\Patterns\Composite;

/**
 * Patron Composite - COMPUESTO.
 *
 * Un EnergyBundle agrupa ofertas (hojas) u otros bundles (hijos). Sus
 * totales se calculan de forma recursiva recorriendo los hijos, sin
 * importar la profundidad del arbol.
 */
class EnergyBundle implements BundleComponent
{
    /** @var array<int, BundleComponent> */
    private array $children = [];

    public function __construct(private string $name) {}

    public function add(BundleComponent $child): self
    {
        $this->children[] = $child;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTotalKwh(): float
    {
        return array_sum(array_map(fn(BundleComponent $c) => $c->getTotalKwh(), $this->children));
    }

    public function getTotalPrice(): float
    {
        return array_sum(array_map(fn(BundleComponent $c) => $c->getTotalPrice(), $this->children));
    }

    public function countLeaves(): int
    {
        return array_sum(array_map(fn(BundleComponent $c) => $c->countLeaves(), $this->children));
    }

    public function getChildren(): array
    {
        return $this->children;
    }

    public function toArray(): array
    {
        return [
            'type' => 'bundle',
            'name' => $this->name,
            'totalKwh' => round($this->getTotalKwh(), 2),
            'totalPrice' => round($this->getTotalPrice(), 2),
            'offerCount' => $this->countLeaves(),
            'children' => array_map(fn(BundleComponent $c) => $c->toArray(), $this->children),
        ];
    }
}
