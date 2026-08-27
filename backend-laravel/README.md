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

## Estructura del Proyecto

```
backend-laravel/
├── app/
│   ├── Http/Controllers/EnergyController.php
│   ├── Models/EnergyOffer.php
│   └── Patterns/
│       ├── MarketService.php
│       ├── LoggerService.php
│       └── ConfigService.php
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
