# Plataforma de Comercio de Energia - Backend API

API REST desarrollada en Laravel para la plataforma de comercio de energía.

## Inicio Rápido

```bash
# Instalar dependencias
composer install

# Generar clave de aplicación
php artisan key:generate

# Iniciar servidor
php artisan serve --port=8000
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/energy/offers` | Crear oferta de energía |
| `GET` | `/api/energy/offers` | Listar ofertas disponibles |
| `POST` | `/api/energy/offers/{id}/purchase` | Comprar energía |
| `GET` | `/api/energy/metrics` | Métricas del mercado |
| `GET` | `/api/energy/source-catalog` | Catálogo de fuentes de energía (Factory Method) |

## Estructura del Proyecto

```
backend-laravel/
├── app/
│   ├── Http/Controllers/EnergyController.php
│   ├── Models/EnergyOffer.php
│   └── Patterns/
│       ├── MarketService.php
│       ├── LoggerService.php
│       ├── ConfigService.php
│       ├── EnergySources/
│       │   ├── EnergySource.php
│       │   ├── SolarEnergy.php
│       │   ├── WindEnergy.php
│       │   └── HydroEnergy.php
│       └── Factories/
│           └── EnergySourceFactory.php
├── routes/api.php
└── bootstrap/app.php
```

## Patrón Singleton - Implementación

### Backend (Laravel)

Los servicios singleton están en `app/Patterns/`:

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| `MarketService` | `app/Patterns/MarketService.php` | Gestión de ofertas y transacciones |
| `LoggerService` | `app/Patterns/LoggerService.php` | Registro de eventos y métricas |
| `ConfigService` | `app/Patterns/ConfigService.php` | Configuración centralizada |

Cada servicio implementa el patrón con:
- `private static ?Instance $instance = null;` — almacenamiento de la instancia única
- `private function __construct()` — constructor privado
- `public static function getInstance(): self` — acceso global controlado

**Uso en el controlador** (`app/Http/Controllers/EnergyController.php:19-21`):
```php
$this->market = MarketService::getInstance();
$this->logger = LoggerService::getInstance();
$this->config = ConfigService::getInstance();
```

### Frontend (React)

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| `EnergyApiService` | `frontend/src/patterns/singleton/energy-api.service.ts` | Cliente HTTP centralizado |

Implementación en `frontend/src/patterns/singleton/energy-api.service.ts:22-35`:
```typescript
class EnergyApiService {
  private static instance: EnergyApiService;
  private constructor() { ... }
  static getInstance(): EnergyApiService { ... }
}
```

## Patrón Factory Method - Implementación

### Backend (Laravel)

La fábrica crea distintos tipos de **fuentes de energía renovable**. Los productos están en `app/Patterns/EnergySources/` y la fábrica en `app/Patterns/Factories/`:

| Elemento | Archivo | Rol |
|----------|---------|-----|
| `EnergySource` (abstract) | `app/Patterns/EnergySources/EnergySource.php` | Producto (interfaz) |
| `SolarEnergy` | `app/Patterns/EnergySources/SolarEnergy.php` | Producto concreto |
| `WindEnergy` | `app/Patterns/EnergySources/WindEnergy.php` | Producto concreto |
| `HydroEnergy` | `app/Patterns/EnergySources/HydroEnergy.php` | Producto concreto |
| `EnergySourceFactory` | `app/Patterns/Factories/EnergySourceFactory.php` | Fábrica (creator) |

**Producto (interfaz)** (`app/Patterns/EnergySources/EnergySource.php`):
```php
abstract class EnergySource
{
    abstract public function getType(): string;
    abstract public function getName(): string;
    abstract public function getEfficiency(): int;
}
```

**Producto concreto** (`app/Patterns/EnergySources/SolarEnergy.php`):
```php
class SolarEnergy extends EnergySource
{
    public function getType(): string { return 'solar'; }
    public function getName(): string { return 'Energia Solar'; }
    public function getEfficiency(): int { return 85; }
}
```

**Fábrica (creator)** (`app/Patterns/Factories/EnergySourceFactory.php`):
```php
class EnergySourceFactory
{
    public function create(string $type): EnergySource
    {
        return match (strtolower($type)) {
            'solar' => new SolarEnergy(),
            'wind'  => new WindEnergy(),
            'hydro' => new HydroEnergy(),
            default => throw new \InvalidArgumentException("Tipo no soportado: {$type}"),
        };
    }
}
```

**Uso en el controlador** (`app/Http/Controllers/EnergyController.php`):
```php
public function getSourceCatalog(): JsonResponse
{
    $sources = array_map(fn($s) => $s->toArray(), $this->sourceFactory->createAll());
    return response()->json($sources);
}
```

**Uso en la creación de ofertas**: `MarketService::registerOffer` reutiliza la fábrica
para validar el tipo de energía y guardarlo en la oferta:
```php
public function registerOffer(array $data): EnergyOffer
{
    $source = (new EnergySourceFactory())->create($data['energyType'] ?? '');
    $offer->energyType = $source->getType();
    // ...
}
```

### Frontend (React)

La fábrica del frontend elige el **componente de React** según el tipo de energía:

| Elemento | Archivo | Rol |
|----------|---------|-----|
| `EnergyCardFactory` | `frontend/src/patterns/factory/EnergyCardFactory.tsx` | Fábrica (creator) |
| `SolarCard` | `frontend/src/patterns/factory/cards/SolarCard.tsx` | Producto concreto |
| `WindCard` | `frontend/src/patterns/factory/cards/WindCard.tsx` | Producto concreto |
| `HydroCard` | `frontend/src/patterns/factory/cards/HydroCard.tsx` | Producto concreto |

**Fábrica** (`frontend/src/patterns/factory/EnergyCardFactory.tsx`):
```typescript
class EnergyCardFactory {
  create(type: string) {
    switch (type) {
      case 'solar': return SolarCard;
      case 'wind':  return WindCard;
      case 'hydro': return HydroCard;
      default: throw new Error(`Tipo de energia no soportado: ${type}`);
    }
  }
}
```

Cada tarjeta tiene un botón **"Publicar oferta"** (`onPublish`) que preselecciona ese
tipo de energía en el formulario `CreateOffer`. La oferta se envía con `energyType`
y el backend la valida nuevamente con `EnergySourceFactory` antes de guardarla.

