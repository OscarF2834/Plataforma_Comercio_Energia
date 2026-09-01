<?php

namespace App\Patterns\Factory;

interface EnergyOffer
{
    public function getType(): string;

    public function getData(): array;
}