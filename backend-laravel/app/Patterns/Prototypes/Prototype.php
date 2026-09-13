<?php

namespace App\Patterns\Prototypes;

interface Prototype
{
    public function copy(): Prototype;
}