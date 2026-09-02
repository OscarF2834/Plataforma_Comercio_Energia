# Plataforma de Comercio de Energía

## Descripción del proyecto

La **Plataforma de Comercio de Energía** es un prototipo de software que permite a los usuarios intercambiar excedentes de energía entre sí.

La plataforma busca facilitar que los usuarios que **producen energía** puedan vender o suministrar sus excedentes a otros usuarios que necesiten consumir energía. Para ello, el sistema permitirá consultar la energía disponible, publicar ofertas, realizar compras y consultar información relacionada con la producción y el consumo energético.

El proyecto está planteado como un **prototipo funcional académico**. No tendrá conexión directa con redes eléctricas ni involucrará procesos reales de facturación, distribución o medición oficial de energía. Todas las operaciones y transacciones se realizarán de manera virtual dentro de la plataforma.

---

## Objetivo principal

Desarrollar una plataforma que permita **gestionar el intercambio de excedentes de energía entre usuarios**, utilizando información relacionada con:

- Producción energética.
- Consumo energético.
- Excedentes disponibles.
- Predicciones básicas de producción.
- Predicciones básicas de consumo.
- Compra y venta de energía.
- Historial de transacciones.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Laravel + PHP |
| Base de datos | Memoria (in-memory) persistida en JSON |
| Patrones de diseño | Singleton, Factory Method |

---

## Usuarios principales

La plataforma contará principalmente con dos tipos de usuarios:

### Productor

Es el usuario que genera energía y puede disponer de excedentes para venderlos dentro de la plataforma.

### Consumidor

Es el usuario que necesita adquirir energía disponible de otros usuarios.

### Usuario con doble rol

Un mismo usuario podrá desempeñar ambos roles.

Por ejemplo, un usuario puede producir energía mediante paneles solares y, al mismo tiempo, consumir energía. Cuando su producción no sea suficiente para cubrir su consumo, podrá comprar energía a otros usuarios.

---

# Subsistemas

La plataforma estará compuesta por los siguientes subsistemas principales:

1. **Subsistema de compra y venta de excedentes energéticos.**
2. **Subsistema de subastas en tiempo real.**
3. **Subsistema de integración con dispositivos IoT domésticos.**
4. **Subsistema de predicción de producción y consumo.**

---

# 1. Subsistema de compra y venta de excedentes energéticos

Este subsistema permitirá realizar el intercambio de energía entre los usuarios de la plataforma.

Su función principal será permitir consultar los excedentes disponibles y adquirirlos mediante transacciones virtuales.

## Funcionalidades principales

- Registrar un excedente de energía.
- Indicar la cantidad disponible de energía en **kWh**.
- Establecer un precio por kWh.
- Consultar los excedentes disponibles.
- Filtrar los excedentes disponibles.
- Realizar la compra de un excedente.
- Registrar las transacciones realizadas.
- Consultar el historial de compras.
- Consultar el historial de ventas.
- Actualizar automáticamente la cantidad de energía disponible después de una compra.

## Ejemplo de funcionamiento

Un usuario posee paneles solares y durante determinado período produce **15 kWh**, pero consume solamente **10 kWh**.

Por lo tanto:

**15 kWh - 10 kWh = 5 kWh de excedente**

Estos **5 kWh representan una parte clave del sistema**, ya que el usuario puede publicarlos en la plataforma indicando un precio determinado.

Otro usuario que necesite energía podrá consultar la oferta y realizar la compra. La plataforma registrará la operación y actualizará la cantidad de energía disponible.

## Alcance

Para evitar que el proyecto sea demasiado grande, inicialmente **no será necesario implementar**:

- Pagos bancarios reales.
- Conexión con empresas de energía.
- Distribución física de electricidad.
- Facturación real.
- Medición oficial de energía.
- Integración directa con redes eléctricas.

Las compras podrán manejarse mediante un **saldo virtual** o un sistema interno de transacciones.

---

# 2. Subsistema de subastas en tiempo real

Este subsistema permitirá realizar subastas sobre determinados excedentes energéticos.

En lugar de que el productor establezca directamente un comprador, podrá publicar una cantidad de energía y establecer las condiciones de una subasta.

Los consumidores interesados podrán realizar ofertas durante un período determinado.

## Funcionamiento básico

Por ejemplo, un productor dispone de:

**10 kWh**

Y establece una subasta con un precio inicial de:

**$500 por kWh**

Los consumidores pueden realizar diferentes ofertas:

- Usuario A: **$500/kWh**
- Usuario B: **$550/kWh**
- Usuario C: **$600/kWh**

Cuando finalice el tiempo establecido para la subasta, el sistema determinará la oferta ganadora y registrará la transacción correspondiente.

## Funcionalidades principales

- Crear una subasta.
- Definir la cantidad de energía disponible.
- Establecer el precio inicial.
- Establecer la fecha y hora de inicio.
- Establecer la fecha y hora de finalización.
- Consultar las subastas activas.
- Realizar ofertas.
- Consultar la oferta más alta.
- Actualizar las ofertas realizadas.
- Finalizar automáticamente la subasta.
- Determinar la oferta ganadora.
- Registrar al ganador.
- Registrar la transacción correspondiente.

## Alcance

Para mantener el proyecto realizable, el concepto de **"tiempo real"** se implementará únicamente dentro de la plataforma.

Por ejemplo, se podrá utilizar:

- Actualización periódica de las ofertas.
- Solicitudes periódicas al servidor.
- WebSocket, si el tiempo y los recursos del equipo lo permiten.

No será necesario construir un sistema de subastas comparable con plataformas comerciales de gran escala.

---

# 3. Subsistema de integración con dispositivos IoT domésticos

Este subsistema permitirá conectar virtualmente dispositivos domésticos, como **medidores inteligentes o inversores**, con el objetivo de automatizar la lectura de generación y consumo de energía.

## Funcionamiento básico

Por ejemplo:

Un medidor inteligente registra que un panel solar produjo **8 kWh a las 2:00 PM**, mientras que la vivienda consumió **5 kWh**.

El dispositivo envía estos datos al sistema y la plataforma calcula automáticamente:

**8 kWh - 5 kWh = 3 kWh de excedente**

De esta manera, el usuario no tendrá que ingresar manualmente la información.

## Funcionalidades principales

- Registrar un dispositivo IoT.
- Vincular un dispositivo IoT con un usuario.
- Simular la recepción periódica de lecturas de generación.
- Simular la recepción periódica de lecturas de consumo.
- Registrar el historial de lecturas.
- Registrar la fecha y hora de cada lectura.
- Calcular automáticamente el excedente diario.
- Calcular automáticamente el excedente horario.
- Consultar el estado de conexión del dispositivo.
- Actualizar la información energética del usuario a partir de las lecturas recibidas.

## Alcance

Para mantener el prototipo manejable, **no será necesario utilizar hardware físico ni implementar protocolos complejos de telecomunicaciones**.

Las lecturas IoT podrán ser simuladas mediante:

- Un script.
- Una API basada en JSON.
- Un formulario de pruebas.
- Datos generados automáticamente de forma periódica.

---

# 4. Subsistema de predicción de producción y consumo

Este subsistema ofrecerá estimaciones a los usuarios sobre la cantidad de energía que podrían producir o consumir en períodos futuros.

El objetivo será ayudar a los usuarios a planificar la **compra y venta anticipada de excedentes energéticos**.

## Funcionamiento básico

El sistema podrá analizar información histórica del usuario, como el promedio de producción y consumo durante determinados períodos.

También podrá utilizar datos simulados relacionados con la radiación solar.

Por ejemplo:

> "Mañana se espera producir 18 kWh y consumir 10 kWh. Se estima un excedente de 8 kWh disponible para ofertar."

## Funcionalidades principales

- Consultar predicciones diarias.
- Consultar predicciones semanales.
- Generar estimaciones de producción energética.
- Generar estimaciones de consumo energético.
- Mostrar gráficos de producción.
- Mostrar gráficos de consumo.
- Mostrar indicadores de predicción.
- Calcular posibles excedentes futuros.
- Generar recomendaciones para vender energía.
- Generar recomendaciones para comprar energía.
- Identificar períodos con mayor producción o consumo.

## Alcance

No será necesario implementar modelos complejos de **Inteligencia Artificial o Machine Learning avanzado**.

Las predicciones podrán desarrollarse utilizando métodos sencillos, como:

- Promedios históricos.
- Promedios ponderados.
- Regresiones lineales simples.
- Datos de prueba precalculados.
- Datos simulados almacenados en la base de datos.

---

# Alcance general del proyecto

El proyecto se desarrollará como un **prototipo funcional de una plataforma de comercio energético**.

El sistema permitirá simular:

- La producción de energía.
- El consumo de energía.
- La generación de excedentes.
- La publicación de ofertas.
- La compra y venta de excedentes.
- Las subastas de energía.
- Las transacciones virtuales.
- La integración simulada con dispositivos IoT.
- Las predicciones básicas de producción y consumo.
- El historial de operaciones.

El proyecto **no contempla**:

- Conexión física con redes eléctricas.
- Distribución real de electricidad.
- Pagos bancarios reales.
- Facturación real.
- Medición oficial de energía.
- Integración obligatoria con empresas comercializadoras de energía.
- Hardware IoT físico.
- Modelos avanzados de Inteligencia Artificial.

---

# Resumen

La **Plataforma de Comercio de Energía** busca desarrollar un entorno virtual donde los usuarios puedan **producir, consumir, comprar y vender excedentes energéticos**.

El sistema estará organizado en cuatro subsistemas principales:

1. **Compra y venta de excedentes energéticos.**
2. **Subastas en tiempo real.**
3. **Integración con dispositivos IoT domésticos.**
4. **Predicción de producción y consumo.**

De esta manera, el proyecto permitirá demostrar el funcionamiento de un mercado energético digital mediante un prototipo controlado, sin depender de infraestructura eléctrica real.

---

# Patrones de Diseño Aplicados

> En esta sección se documentan los patrones de diseño implementados en el proyecto.
> Cada patrón incluye un **en qué consiste dentro del proyecto** y su **diagrama UML individual**.
> Los patrones se van añadiendo a medida que se implementan (búscalos directamente en el índice).

## Índice de Patrones

| # | Patrón | Implementación | Capa | Sección |
|---|--------|----------------|------|---------|
| 1 | [Singleton](#1-marketservice--backend) · `MarketService` | Backend | [Ir](#1-marketservice--backend) |
| 2 | [Singleton](#2-loggerservice--backend) · `LoggerService` | Backend | [Ir](#2-loggerservice--backend) |
| 3 | [Singleton](#3-configservice--backend) · `ConfigService` | Backend | [Ir](#3-configservice--backend) |
| 4 | [Singleton](#4-energyapiservice--frontend) · `EnergyApiService` | Frontend | [Ir](#4-energyapiservice--frontend) |
| 5 | [Factory Method](#5-energysourcefactory--backend) · `EnergySourceFactory` | Backend | [Ir](#5-energysourcefactory--backend) |
| 6 | [Factory Method](#6-energycardfactory--frontend) · `EnergyCardFactory` | Frontend | [Ir](#6-energycardfactory--frontend) |

---

# Patrón Singleton

## ¿Qué es dentro del proyecto?

El **Singleton** se usa en el proyecto para garantizar que ciertos servicios (configuración, logs y el mercado de energía) tengan **una única instancia compartida** en toda la aplicación. De esta forma, todos los controladores y componentes usan el **mismo estado y los mismos datos**, evitando duplicar memoria o perder información entre servicios.

**Implementaciones actuales (4):**

- `MarketService` — Backend (PHP)
- `LoggerService` — Backend (PHP)
- `ConfigService` — Backend (PHP)
- `EnergyApiService` — Frontend (TypeScript)

---

## 1. `MarketService` — Backend

**Archivo:** `backend-laravel/app/Patterns/MarketService.php`

**En qué consiste dentro del proyecto:** Gestión centralizada del mercado de energía. Almacena todas las ofertas de excedentes en una única instancia, las persiste en un archivo JSON y las mantiene compartidas entre todos los controladores. Además, al registrar una oferta delega en `EnergySourceFactory` la validación y normalización del tipo de energía (usa el patrón Factory Method internamente).

**Diagrama UML:**

```
┌───────────────────────────────────────────────────────────────┐
│                     «Singleton»                               │
│                   MarketService                                │
├───────────────────────────────────────────────────────────────┤
│ - instance : MarketService        (única instancia)           │
│ - offers : array                 (ofertas del mercado)        │
│ - nextId : int                                                │
│ - transactionCount : int                                       │
│ - dataFile : string                                            │
├───────────────────────────────────────────────────────────────┤
│ - __construct()            (privado)                          │
│ + getInstance() : MarketService      (devuelve la misma)       │
│ + registerOffer(array) : EnergyOffer                           │
│ + getAvailableOffers() : array                                 │
│ + purchaseOffer(int, int) : array                              │
│ + getMetrics() : array                                         │
└───────────────────────────────────────────────────────────────┘
        │                                     │
        │ 1                                 1 │  usa
        ▼                                     ▼
┌───────────────┐                    ┌────────────────────────┐
│ EnergyController │                 │ EnergySourceFactory     │
│  (consume)       │                 │  (Factory Method)       │
└───────────────┘                    └────────────────────────┘
```

**Código clave:**

```php
private static ?MarketService $instance = null;   // 1. atributo estático
private function __construct() {}                  // 2. constructor privado

public static function getInstance(): self          // 3. acceso global
{
    if (self::$instance === null) {
        self::$instance = new self();
    }
    return self::$instance;
}

public function registerOffer(array $data): EnergyOffer
{
    // Delega en la fábrica (Factory Method) para validar el tipo
    $source = (new EnergySourceFactory())->create($data['energyType'] ?? '');
    // ...crea y guarda la oferta en $this->offers
}
```

---

## 2. `LoggerService` — Backend

**Archivo:** `backend-laravel/app/Patterns/LoggerService.php`

**En qué consiste dentro del proyecto:** Registro centralizado de eventos y métricas de la aplicación. Mantiene en una única instancia el historial de logs, el contador de transacciones y el contador de ofertas, persistiéndolos en un archivo JSON para que no se pierdan entre peticiones.

**Diagrama UML:**

```
┌───────────────────────────────────────────────────────────────┐
│                     «Singleton»                               │
│                   LoggerService                               │
├───────────────────────────────────────────────────────────────┤
│ - instance : LoggerService        (única instancia)           │
│ - logs : array                   (historial de eventos)       │
│ - transactionCount : int                                       │
│ - offerCount : int                                             │
│ - dataFile : string                                            │
├───────────────────────────────────────────────────────────────┤
│ - __construct()            (privado)                          │
│ + getInstance() : LoggerService      (devuelve la misma)       │
│ + log(string) : void                                            │
│ + incrementTransactions() : void                                │
│ + incrementOffers() : void                                      │
│ + getMetrics() : array                                          │
└───────────────────────────────────────────────────────────────┘
        │
        │ 1
        ▼
┌───────────────┐
│ EnergyController │
│  (consume)       │
└───────────────┘
```

**Código clave:**

```php
private static ?LoggerService $instance = null;
private function __construct() {}

public static function getInstance(): self
{
    if (self::$instance === null) {
        self::$instance = new self();
    }
    return self::$instance;
}

public function log(string $message): void
{
    $this->logs[] = '[' . date('Y-m-d H:i:s') . '] ' . $message;
    $this->save();
}
```

---

## 3. `ConfigService` — Backend

**Archivo:** `backend-laravel/app/Patterns/ConfigService.php`

**En qué consiste dentro del proyecto:** Configuración centralizada de la plataforma. Almacena en una única instancia las constantes globales (nombre del mercado, precio por defecto por kWh, moneda y máximo de oferta), de modo que todos los servicios lean los mismos valores sin recalcularlos.

**Diagrama UML:**

```
┌───────────────────────────────────────────────────────────────┐
│                     «Singleton»                               │
│                   ConfigService                               │
├───────────────────────────────────────────────────────────────┤
│ - instance : ConfigService         (única instancia)          │
│ - config : array                   (valores de configuración) │
│      marketName, defaultPricePerKwh,                          │
│      currency, maxOfferKwh                                    │
├───────────────────────────────────────────────────────────────┤
│ - __construct()            (privado)                          │
│ + getInstance() : ConfigService       (devuelve la misma)      │
│ + get(string) : mixed                                          │
│ + getAll() : array                                             │
└───────────────────────────────────────────────────────────────┘
        │
        │ 1
        ▼
┌───────────────┐
│ EnergyController │
│  (consume)       │
└───────────────┘
```

**Código clave:**

```php
private static ?ConfigService $instance = null;
private function __construct() {}

public static function getInstance(): self
{
    if (self::$instance === null) {
        self::$instance = new self();
    }
    return self::$instance;
}

public function get(string $key): mixed
{
    return $this->config[$key] ?? null;
}
```

---

## 4. `EnergyApiService` — Frontend

**Archivo:** `frontend/src/patterns/singleton/energy-api.service.ts`

**En qué consiste dentro del proyecto:** Cliente HTTP centralizado del frontend. Expone una única instancia que encapsula todas las llamadas al backend (consultar ofertas, crear ofertas, comprar, métricas y catálogo de fuentes). Todos los componentes de React comparten así el mismo cliente y la misma URL base.

**Diagrama UML:**

```
┌───────────────────────────────────────────────────────────────┐
│                     «Singleton»                               │
│                 EnergyApiService                              │
├───────────────────────────────────────────────────────────────┤
│ - instance : EnergyApiService       (única instancia)         │
│ - baseUrl : string                  (http://localhost:8000/api)│
├───────────────────────────────────────────────────────────────┤
│ - constructor()               (privado)                       │
│ + getInstance() : EnergyApiService  (devuelve la misma)       │
│ + getAvailableOffers() : Promise<EnergyOffer[]>               │
│ + createOffer(offer) : Promise<EnergyOffer>                   │
│ + purchaseOffer(id, kwh) : Promise                             │
│ + getMetrics() : Promise                                       │
│ + getSourceCatalog() : Promise                                 │
└───────────────────────────────────────────────────────────────┘
        ▲          ▲          ▲
        │          │          │ 1  (todos usan la misma instancia)
┌───────────────┐ ┌────────────────┐ ┌────────────────┐
│  EnergyCatalog │ │ EnergyDashboard │ │  CreateOffer    │
│  (React)       │ │  (React)        │ │  (React)        │
└───────────────┘ └────────────────┘ └────────────────┘
```

**Código clave:**

```typescript
class EnergyApiService {
  private static instance: EnergyApiService;
  private baseUrl: string;

  private constructor() {                       // constructor privado
    this.baseUrl = 'http://localhost:8000/api';
  }

  static getInstance(): EnergyApiService {       // acceso global
    if (!EnergyApiService.instance) {
      EnergyApiService.instance = new EnergyApiService();
    }
    return EnergyApiService.instance;
  }
}
```

---

# Patrón Factory Method

## ¿Qué es dentro del proyecto?

El **Factory Method** se usa en el proyecto para **centralizar la creación de objetos** según un tipo. En lugar de que el código de negocio haga `new` directamente, una **fábrica** recibe un tipo (`"solar"`, `"wind"`, `"hydro"`) y devuelve la clase concreta correcta. De esta forma es fácil **extender el sistema**: basta con crear una nueva clase y registrarla en la fábrica.

**Implementaciones actuales (2):**

- `EnergySourceFactory` — Backend (PHP/`EnergySource`)
- `EnergyCardFactory` — Frontend (TypeScript/React)

---

## 5. `EnergySourceFactory` — Backend

**Archivo:** `backend-laravel/app/Patterns/Factories/EnergySourceFactory.php`

**En qué consiste dentro del proyecto:** Fabrica las diferentes **fuentes de energía renovable** del catálogo. Según el tipo recibido crea una instancia concreta de `SolarEnergy`, `WindEnergy` o `HydroEnergy` (todas subclases de `EnergySource`). Si el tipo no existe, lanza una excepción (que el backend responde como `422`). Se usa tanto en el catálogo (`createAll`) como en la validación de tipo al crear una oferta (`MarketService`).

**Diagrama UML:**

```
┌──────────────────────────────┐
│      «Creator / Fábrica»     │
│    EnergySourceFactory       │
├──────────────────────────────┤
│ + TYPES : array              │
├──────────────────────────────┤
│ + create(string) :           │
│        EnergySource          │
│ + createAll() : array        │
└──────────────┬───────────────┘
               │  crea
               ▼
┌──────────────────────────────────────────────────┐
│           «Producto»                             │
│    abstract class EnergySource                   │
├──────────────────────────────────────────────────┤
│ + getType() : string        (abstract)           │
│ + getName() : string        (abstract)           │
│ + getDescription() : string (abstract)           │
│ + getEfficiency() : int     (abstract)           │
│ + getColor() : string       (abstract)           │
│ + toArray() : array                              │
└──────────────────────────────────────────────────┘
               ▲          ▲          ▲
               │          │          │  extienden
    ┌──────────────┐ ┌───────────┐ ┌───────────┐
    │  SolarEnergy │ │ WindEnergy│ │HydroEnergy│
    │  e=85 #f39c12│ │ e=70 #34..│ │ e=92 #2e..│
    └──────────────┘ └───────────┘ └───────────┘
```

**Código clave:**

```php
class EnergySourceFactory
{
    public const TYPES = ['solar', 'wind', 'hydro'];

    public function create(string $type): EnergySource
    {
        return match (strtolower($type)) {
            'solar' => new SolarEnergy(),
            'wind'  => new WindEnergy(),
            'hydro' => new HydroEnergy(),
            default => throw new \InvalidArgumentException("Tipo de energia no soportado: {$type}"),
        };
    }

    public function createAll(): array
    {
        return array_map(fn(string $type) => $this->create($type), self::TYPES);
    }
}
```

**Uso en `EnergyController`:**

```php
// Endpoint GET /api/energy/source-catalog
$sources = array_map(fn($source) => $source->toArray(), $this->sourceFactory->createAll());
```

---

## 6. `EnergyCardFactory` — Frontend

**Archivo:** `frontend/src/patterns/factory/EnergyCardFactory.tsx`

**En qué consiste dentro del proyecto:** Fabrica el **componente de React correcto** según el tipo de energía. Recibe un tipo (`"solar"`, `"wind"`, `"hydro"`) y devuelve la tarjeta visual correspondiente (`SolarCard`, `WindCard` o `HydroCard`) para el catálogo de energía. Se exporta como una única instancia de fábrica compartida.

**Diagrama UML:**

```
┌──────────────────────────────┐
│      «Creator / Fábrica»     │
│     EnergyCardFactory        │
├──────────────────────────────┤
│ + create(string) :           │
│        CardComponent         │
└──────────────┬───────────────┘
               │  crea
               ▼
┌──────────────────────────────────────────────────┐
│        «Producto / Interfaz»                    │
│   interface EnergySource  (types.ts)             │
├──────────────────────────────────────────────────┤
│ + type : string                                  │
│ + name : string                                  │
│ + description : string                           │
│ + efficiency : number                            │
│ + color : string                                 │
└──────────────────────────────────────────────────┘
        ▲              ▲              ▲
        │              │              │  componentes
        │              │              │  (renderizan)
    ┌──────────┐   ┌─────────┐    ┌─────────┐
    │ SolarCard │   │WindCard │    │HydroCard│
    │  ☀️ #f39c12│   │ 🌬️ #3498db│   │ 💧 #2ecc71│
    └──────────┘   └─────────┘    └─────────┘
```

**Código clave:**

```typescript
class EnergyCardFactory {
  create(type: string): CardComponent {
    switch (type) {
      case 'solar': return SolarCard;
      case 'wind':  return WindCard;
      case 'hydro': return HydroCard;
      default:      throw new Error(`Tipo de energia no soportado: ${type}`);
    }
  }
}

// Se exporta una única instancia compartida
const instance = new EnergyCardFactory();
export default instance;
```

**Uso en `EnergyCatalog` (React):**

```typescript
// La fábrica elige el componente según el tipo
const Card = energyCardFactory.create(source.type);
return <Card key={source.type} source={source} onPublish={onPublish} />;
```

---

# Guía de Ejecución

## Backend (Laravel)

```bash
cd backend-laravel
composer install
php artisan key:generate
php artisan serve --port=8000
```

El backend corre en `http://localhost:8000`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/energy/offers` | Crear una oferta de excedente |
| GET | `/api/energy/offers` | Consultar ofertas disponibles |
| POST | `/api/energy/offers/{id}/purchase` | Comprar energía de una oferta |
| GET | `/api/energy/metrics` | Ver métricas del mercado |
| GET | `/api/energy/source-catalog` | Ver catálogo de fuentes de energía (Factory Method) |

## Ejemplo de Request

```bash
# Crear oferta (energyType se valida con EnergySourceFactory)
curl -X POST http://localhost:8000/api/energy/offers \
  -H "Content-Type: application/json" \
  -d '{
    "producerName": "Juan Perez",
    "totalKwh": 15,
    "pricePerKwh": 500,
    "energyType": "solar",
    "description": "Excedente de paneles solares"
  }'

# Consultar ofertas
curl http://localhost:8000/api/energy/offers

# Comprar energía
curl -X POST http://localhost:8000/api/energy/offers/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"kwh": 5}'

# Consultar catálogo de fuentes (Factory Method)
curl http://localhost:8000/api/energy/source-catalog
```

##  Video explicativo

> **Demostración del proyecto**
>
> En el siguiente video podrás conocer el funcionamiento del proyecto, observar sus principales características y ver una demostración de su implementación.

**[Ver video completo en YouTube](https://youtu.be/mqDKzU9JejY)**

[![Ver video explicativo](https://img.youtube.com/vi/mqDKzU9JejY/maxresdefault.jpg)](https://youtu.be/mqDKzU9JejY)
---

## Proximo Patron (Semana 2)

*Proximamente se implementara el siguiente patron de diseno...*

