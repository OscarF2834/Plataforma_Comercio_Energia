<?php

namespace App\Patterns\Composite;

/**
 * Patron Composite - CLIENTE.
 *
 * Construye el arbol de paquetes de energia y expone sus agregados
 * recursivos. Tambien evalúa arboles recibidos como JSON (cada nodo
 * declara su tipo: "bundle" u "offer").
 */
class BundleService
{
    /** Arbol de demostracion: un paquete con dos paquetes hijos. */
    public function getSampleTree(): array
    {
        $solar = new EnergyBundle('Paquete Solar Residencial');
        $solar
            ->add(new OfferLeaf('Paneles techo casa', 15, 480, 'solar'))
            ->add(new OfferLeaf('Excedente patio', 5, 500, 'solar'));

        $renewable = new EnergyBundle('Paquete Renovable Mixto');
        $renewable
            ->add(new OfferLeaf('Aerogenerador finca', 20, 450, 'wind'))
            ->add(new OfferLeaf('Microhidro local', 8, 520, 'hydro'));

        $market = new EnergyBundle('Paquete del Mercado');
        $market->add($solar)->add($renewable);

        return $market->toArray();
    }

    /**
     * Evalua un arbol recibido como JSON y devuelve el mismo arbol con los
     * totales recursivos calculados por el Composite.
     */
    public function evaluate(array $node): array
    {
        return $this->build($node)->toArray();
    }

    private function build(array $node): BundleComponent
    {
        $type = strtolower($node['type'] ?? '');

        if ($type === 'offer') {
            if (!isset($node['kwh'], $node['pricePerKwh']) || !isset($node['name'])) {
                throw new \InvalidArgumentException('Cada oferta hoja requiere name, kwh y pricePerKwh');
            }
            return new OfferLeaf(
                (string) $node['name'],
                (float) $node['kwh'],
                (float) $node['pricePerKwh'],
                (string) ($node['energyType'] ?? 'solar'),
            );
        }

        if ($type === 'bundle') {
            $bundle = new EnergyBundle((string) ($node['name'] ?? 'Paquete'));
            foreach ($node['children'] ?? [] as $child) {
                $bundle->add($this->build($child));
            }
            return $bundle;
        }

        throw new \InvalidArgumentException("Nodo desconocido: '{$type}'. Usa 'offer' o 'bundle'.");
    }
}
