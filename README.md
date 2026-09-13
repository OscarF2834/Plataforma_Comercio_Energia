# Plataforma de Comercio de Energía

## Descripción del proyecto

La **Plataforma de Comercio de Energía** es un prototipo de software que permite a los usuarios intercambiar excedentes de energía entre sí.

La plataforma busca facilitar que los usuarios que **producen energía** puedan vender o suministrar sus excedentes a otros usuarios que necesiten consumir energía. Para ello, el sistema permitirá consultar la energía disponible, publicar ofertas, realizar compras y consultar información relacionada con la producción y el consumo energético.

El proyecto está planteado como un **prototipo funcional académico**. No tendrá conexión directa con redes eléctricas ni involucrará procesos reales de facturación, distribución o medición oficial de energía. Todas las operaciones y transacciones se realizarán de manera virtual dentro de la plataforma.

---

## 📑 Acceso rápido a los Patrones de Diseño

> Navega directamente a cada patrón implementado en el proyecto desde el índice de la sección de patrones.

- [1. `MarketService` (Singleton — Backend)](#1-marketservice--backend)
- [2. `LoggerService` (Singleton — Backend)](#2-loggerservice--backend)
- [3. `ConfigService` (Singleton — Backend)](#3-configservice--backend)
- [4. `EnergyApiService` (Singleton — Frontend)](#4-energyapiservice--frontend)
- [5. `EnergySourceFactory` (Factory Method — Backend)](#5-energysourcefactory--backend)
- [6. `EnergyCardFactory` (Factory Method — Frontend)](#6-energycardfactory--frontend)
- [7. `AbstractPredictor` (Abstract Method — Backend)](#7-abstractpredictor--backend)
- [8. `Predictor` (Abstract Method — Frontend)](#8-predictor--frontend)
- [9. `EnergyOfferBuilder` / `OfferDirector` (Builder — Backend)](#9-energyofferbuilder--offerdirector--backend)
- [10. `EnergyOfferBuilder` / `OfferDirector` (Builder — Frontend)](#10-energyofferbuilder--offerdirector--frontend)

---

## Objetivo principal

Desarrollar una plataforma web para gestionar el intercambio de excedentes de energía entre usuarios, integrando la gestión de producción, consumo, excedentes, predicciones, compra, venta e historial de transacciones, con una arquitectura organizada, escalable y mantenible.

## Objetivos específicos

- Diseñar e implementar una plataforma que permita registrar y gestionar información relacionada con la producción y el consumo energético de los usuarios.
- Gestionar los excedentes de energía disponibles para facilitar su intercambio entre usuarios de acuerdo con la oferta y demanda registrada.
- Clasificar y administrar los diferentes tipos de energía disponibles (solar, eólica e hidráulica) dentro de la plataforma, permitiendo incorporar nuevas categorías de manera organizada.
- Integrar funcionalidades que permitan realizar procesos de compra y venta de los excedentes energéticos entre los usuarios.
- Registrar y consultar el historial de transacciones realizadas, proporcionando información organizada sobre las operaciones efectuadas.
- Incorporar mecanismos básicos de predicción de producción y consumo energético para apoyar la toma de decisiones dentro de la plataforma.
- Evaluar el funcionamiento de la plataforma mediante pruebas funcionales que permitan verificar el correcto cumplimiento de los requerimientos establecidos.
---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Laravel + PHP |
| Base de datos | Memoria (in-memory) persistida en JSON |
| Patrones de diseño | Singleton, Factory Method, Abstract Method, Builder |

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
| 7 | [Abstract Method](#7-abstractpredictor--backend) · `AbstractPredictor` | Backend | [Ir](#7-abstractpredictor--backend) |
| 8 | [Abstract Method](#8-predictor--frontend) · `Predictor` | Frontend | [Ir](#8-predictor--frontend) |
| 9 | [Builder](#9-energyofferbuilder--offerdirector--backend) · `EnergyOfferBuilder` + `OfferDirector` | Backend | [Ir](#9-energyofferbuilder--offerdirector--backend) |
| 10 | [Builder](#10-energyofferbuilder--offerdirector--frontend) · `EnergyOfferBuilder` + `OfferDirector` | Frontend | [Ir](#10-energyofferbuilder--offerdirector--frontend) |

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

## Video explicativo del proyecto

> **Demostración del proyecto**
>
> En el siguiente video podrás conocer el funcionamiento del proyecto, observar sus principales características y ver una demostración de su implementación.

**[Ver video completo en YouTube](https://youtu.be/mqDKzU9JejY)**

[![Ver video explicativo](https://img.youtube.com/vi/mqDKzU9JejY/maxresdefault.jpg)](https://youtu.be/mqDKzU9JejY)

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

**Código completo de la fábrica** (`EnergySourceFactory.php`):

```php
<?php

namespace App\Patterns\Factories;

use App\Patterns\EnergySources\EnergySource;
use App\Patterns\EnergySources\HydroEnergy;
use App\Patterns\EnergySources\SolarEnergy;
use App\Patterns\EnergySources\WindEnergy;

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

**Producto abstracto** (`EnergySource.php`):

```php
<?php

namespace App\Patterns\EnergySources;

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
}
```

**Productos concretos** (`SolarEnergy.php`, `WindEnergy.php`, `HydroEnergy.php`):

```php
// SolarEnergy.php
class SolarEnergy extends EnergySource
{
    public function getType(): string { return 'solar'; }
    public function getName(): string { return 'Energia Solar'; }
    public function getDescription(): string
    {
        return 'Captura la luz del sol mediante paneles fotovoltaicos para generar electricidad de forma limpia.';
    }
    public function getEfficiency(): int { return 85; }
    public function getColor(): string { return '#f39c12'; }
}

// WindEnergy.php
class WindEnergy extends EnergySource
{
    public function getType(): string { return 'wind'; }
    public function getName(): string { return 'Energia Eolica'; }
    public function getDescription(): string
    {
        return 'Aprovecha el viento mediante aerogeneradores para producir electricidad renovable.';
    }
    public function getEfficiency(): int { return 70; }
    public function getColor(): string { return '#3498db'; }
}

// HydroEnergy.php
class HydroEnergy extends EnergySource
{
    public function getType(): string { return 'hydro'; }
    public function getName(): string { return 'Energia Hidraulica'; }
    public function getDescription(): string
    {
        return 'Convierte la energia del agua en movimiento en electricidad aprovechando embalses y corrientes.';
    }
    public function getEfficiency(): int { return 92; }
    public function getColor(): string { return '#2ecc71'; }
}
```

**Uso 1 — Catálogo en `EnergyController`** (endpoint `GET /api/energy/source-catalog`):

```php
public function getSourceCatalog(): JsonResponse
{
    $sources = array_map(
        fn($source) => $source->toArray(),
        $this->sourceFactory->createAll()
    );

    return response()->json($sources);
}
```

**Uso 2 — Validación de tipo al crear una oferta en `MarketService`** (endpoint `POST /api/energy/offers`):

```php
public function registerOffer(array $data): EnergyOffer
{
    // Usa el Factory Method para validar y normalizar el tipo de energia.
    // Si el tipo no es soportado, la fabrica lanza una excepcion (422).
    $source = (new EnergySourceFactory())->create($data['energyType'] ?? '');

    $offer = new EnergyOffer();
    $offer->id = $this->nextId++;
    $offer->producerName = $data['producerName'];
    $offer->totalKwh = $data['totalKwh'];
    $offer->availableKwh = $data['totalKwh'];
    $offer->pricePerKwh = $data['pricePerKwh'];
    $offer->description = $data['description'] ?? '';
    $offer->energyType = $source->getType();
    $offer->createdAt = now()->toIso8601String();

    $this->offers[] = $offer;
    $this->save();

    return $offer;
}
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

**Código completo de la fábrica** (`EnergyCardFactory.tsx`):

```tsx
import SolarCard from './cards/SolarCard';
import WindCard from './cards/WindCard';
import HydroCard from './cards/HydroCard';
import type { EnergySource } from './types';

type CardComponent = (props: { source: EnergySource }) => JSX.Element;

class EnergyCardFactory {
  create(type: string): (props: { source: EnergySource }) => JSX.Element {
    switch (type) {
      case 'solar':
        return SolarCard;
      case 'wind':
        return WindCard;
      case 'hydro':
        return HydroCard;
      default:
        throw new Error(`Tipo de energia no soportado: ${type}`);
    }
  }
}

// Se exporta una única instancia compartida
const instance = new EnergyCardFactory();
export default instance;
export type { CardComponent };
```

**Interfaz / Producto** (`types.ts`):

```typescript
export interface EnergySource {
  type: string;
  name: string;
  description: string;
  efficiency: number;
  color: string;
}
```

**Productos concretos (componentes de React)** (`cards/SolarCard.tsx`, `cards/WindCard.tsx`, `cards/HydroCard.tsx`):

```tsx
// cards/SolarCard.tsx
import type { EnergySource } from '../types';

export default function SolarCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '2rem' }}>☀️</div>
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Solar</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#fdf3e3',
  border: '2px solid #f39c12',
  color: '#7a5200',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#8a5a00' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
```

```tsx
// cards/WindCard.tsx
import type { EnergySource } from '../types';

export default function WindCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '2rem' }}>🌬️</div>
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Eolica</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#eaf4fb',
  border: '2px solid #3498db',
  color: '#1f5a85',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#1f6fa5' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
```

```tsx
// cards/HydroCard.tsx
import type { EnergySource } from '../types';

export default function HydroCard({ source }: { source: EnergySource }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '2rem' }}>💧</div>
      <h3 style={titleStyle}>{source.name}</h3>
      <p style={descStyle}>{source.description}</p>
      <p style={tagStyle}>
        Tipo: <strong>Hidraulica</strong> · Rendimiento {source.efficiency}%
      </p>
    </div>
  );
}

const style: React.CSSProperties = {
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#e9f9f0',
  border: '2px solid #2ecc71',
  color: '#1c6b3f',
};

const titleStyle: React.CSSProperties = { margin: '8px 0', color: '#1e8b4f' };
const descStyle: React.CSSProperties = { fontSize: '0.9rem', margin: '6px 0' };
const tagStyle: React.CSSProperties = { margin: '8px 0 0 0', fontSize: '0.85rem' };
```

**Uso en `EnergyCatalog` (React):**

```tsx
import energyCardFactory from '../patterns/factory/EnergyCardFactory';
// ...
{sources.map((source) => {
  // La fábrica elige el componente según el tipo
  const Card = energyCardFactory.create(source.type);
  const active = selectedEnergyType === source.type;
  return (
    <div
      key={source.type}
      onClick={() => onSelect(active ? null : source.type)}
      style={styles.cardButton(active)}
      title={active ? 'Clic para deseleccionar' : `Seleccionar ${source.name}`}
    >
      {active && <span style={styles.check}>Seleccionado</span>}
      <Card source={source} />
    </div>
  );
})}
```

### 🎥 Video explicativo — Implementación del patrón Factory Method

[Ver video en YouTube](https://youtu.be/C1rYGplK0Og)

---

# Patrón Abstract Method

## ¿Qué es dentro del proyecto?

El **Abstract Method** (conocido en la literatura GoF como **Template Method**) se usa en el proyecto para **definir el esqueleto de un algoritmo heredable**. Una **clase base abstracta** declara los métodos abstractos que cada variante debe implementar y, a la vez, implementa un **método plantilla** (`predict`) que orquesta esos métodos para producir un resultado.

De esta forma, la lógica de cálculo (producción, consumo, excedente, déficit y recomendación) queda **reutilizada y centralizada** en la clase base, mientras que cada subclase solo aporta los **datos específicos** de su período. En este caso se aplica al **subsistema de predicción de producción y consumo**, uno de los objetivos específicos del proyecto.

**Implementaciones actuales (2):**

- `AbstractPredictor` — Backend (PHP) con `DailyPredictor` y `WeeklyPredictor`
- `Predictor` — Frontend (TypeScript) con `DailyPredictor` y `WeeklyPredictor`

---

## 7. `AbstractPredictor` — Backend

**Archivo:** `backend-laravel/app/Patterns/Predictors/AbstractPredictor.php`

**En qué consiste dentro del proyecto:** Clase base abstracta que define los métodos abstractos `getPeriod()`, `getProductionEstimate()`, `getConsumptionEstimate()`, `getDescription()` y `getColor()`, además del **método plantilla** `predict()` que orquesta el algoritmo completo: calcula producción, consumo, excedente/déficit, determina una **acción sugerida** (`publish` / `buy` / `none`) y genera una recomendación.

Está **ligada al resto del sistema**: recibe la **producción y el consumo registrados por el usuario** y el **estado real del mercado** (obtenido de `MarketService::getMarketContext()`: ofertas activas, kWh disponibles, precio promedio y transacciones). Las subclases (`DailyPredictor` y `WeeklyPredictor`) usan esos datos como base y la recomendación hace referencia a las cifras reales del mercado. `PredictorFactory` (Factory Method) instancia el predictor correcto según el período. El endpoint `GET /api/energy/predictions` devuelve las predicciones con su contexto de mercado integrado.

**Diagrama UML:**

```
┌───────────────────────────────────────────────┐
│          «Clase Base Abstracta»               │
│            AbstractPredictor                  │
├───────────────────────────────────────────────┤
│ # production : float         (datos usuario)  │
│ # consumption : float        (datos usuario)  │
│ # marketContext : array      (estado real)    │
│ # getPeriod() : string        (abstract)      │
│ # getProductionEstimate():float(abstract)     │
│ # getConsumptionEstimate():float(abstract)    │
│ # getDescription() : string   (abstract)      │
│ # getColor() : string         (abstract)      │
│                                               │
│ # getAction(float): string    publish/buy/none│
│ # buildRecommendation(float):string           │
│ + predict() : array            (plantilla)    │
└───────────────────────▲───────────────────────┘
                        │  extienden
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  DailyPredictor  │          │  WeeklyPredictor │
│  period: daily   │          │  period: weekly  │
│  prod: 18/real   │          │  prod:×6/real×6  │
│  cons: 10/real   │          │  cons:×13/real×6 │
│  color:#f39c12   │          │  color:#3498db    │
└──────────────────┘          └──────────────────┘
        │  usan mercado real (MarketService)
        ▼
┌───────────────────────────────────────────────┐
│          MarketService::getMarketContext()    │
│  totalOffers · activeOffers · totalAvailable  │
│  Kwh · avgPricePerKwh · transactionCount      │
└───────────────────────────────────────────────┘
```

**Código completo de la clase abstracta** (`AbstractPredictor.php`):

```php
<?php

namespace App\Patterns\Predictors;

abstract class AbstractPredictor
{
    protected float $production;
    protected float $consumption;
    protected array $marketContext;

    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        $this->production = $production;
        $this->consumption = $consumption;
        $this->marketContext = $marketContext;
    }

    public function setData(float $production, float $consumption): self
    {
        $this->production = $production;
        $this->consumption = $consumption;
        return $this;
    }

    abstract public function getPeriod(): string;
    abstract public function getProductionEstimate(): float;
    abstract public function getConsumptionEstimate(): float;
    abstract public function getDescription(): string;
    abstract public function getColor(): string;

    final public function predict(): array
    {
        $production = $this->getProductionEstimate();
        $consumption = $this->getConsumptionEstimate();
        $surplus = $production - $consumption;

        return [
            'period' => $this->getPeriod(),
            'description' => $this->getDescription(),
            'color' => $this->getColor(),
            'productionEstimate' => round($production, 2),
            'consumptionEstimate' => round($consumption, 2),
            'surplusEstimate' => round(max(0, $surplus), 2),
            'deficitEstimate' => round(max(0, -$surplus), 2),
            'action' => $this->getAction($surplus),
            'recommendation' => $this->buildRecommendation($surplus),
            'market' => $this->marketContext,   // estado real del mercado
        ];
    }

    protected function getAction(float $surplus): string
    {
        if ($surplus > 0) return 'publish';
        if ($surplus < 0) return 'buy';
        return 'none';
    }

    protected function buildRecommendation(float $surplus): string
    {
        $avgPrice = round($this->marketContext['avgPricePerKwh'] ?? 0, 2);
        $available = $this->marketContext['totalAvailableKwh'] ?? 0;
        $activeOffers = $this->marketContext['activeOffers'] ?? 0;

        if ($surplus > 0) {
            return "Se estima un excedente de {$surplus} kWh. Puedes venderlo: el mercado promedia {$avgPrice} COP/kWh.";
        }
        if ($surplus < 0) {
            return "Se estima un deficit de " . abs($surplus) . " kWh. El mercado dispone de {$available} kWh en {$activeOffers} ofertas activas; compra para cubrir tu consumo.";
        }
        return 'Tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.';
    }
}
```

**Subclases concretas** (`DailyPredictor.php`, `WeeklyPredictor.php`):

```php
// DailyPredictor.php
class DailyPredictor extends AbstractPredictor
{
    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        parent::__construct($production, $consumption, $marketContext);
    }

    public function getPeriod(): string { return 'daily'; }

    public function getProductionEstimate(): float
    {
        // Usa los datos del usuario si fueron enviados; si no, valor historico de prueba
        return $this->production > 0 ? $this->production : 18.0;
    }

    public function getConsumptionEstimate(): float
    {
        return $this->consumption > 0 ? $this->consumption : 10.0;
    }

    public function getDescription(): string
    {
        return 'Prediccion diaria basada en la produccion y consumo registrados en el ultimo periodo.';
    }
    public function getColor(): string { return '#f39c12'; }
}

// WeeklyPredictor.php
class WeeklyPredictor extends AbstractPredictor
{
    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        parent::__construct($production, $consumption, $marketContext);
    }

    public function getPeriod(): string { return 'weekly'; }

    public function getProductionEstimate(): float
    {
        // Escala el dato diario del usuario a una semana (×6), o usa valor historico
        return $this->production > 0 ? $this->production * 6 : 21.5;
    }

    public function getConsumptionEstimate(): float
    {
        return $this->consumption > 0 ? $this->consumption * 6 : 13.0;
    }

    public function getDescription(): string
    {
        return 'Prediccion semanal basada en el promedio ponderado de produccion y consumo de la ultima semana.';
    }
    public function getColor(): string { return '#3498db'; }
}
```

**Fábrica de predictores** (`PredictorFactory.php`) — usa Factory Method para crear el predictor según el período y le inyecta los datos del usuario **y el contexto real del mercado**:

```php
class PredictorFactory
{
    public const TYPES = ['daily', 'weekly'];

    public function create(string $period, float $production = 0.0, float $consumption = 0.0, array $marketContext = []): AbstractPredictor
    {
        return match (strtolower($period)) {
            'daily'  => new DailyPredictor($production, $consumption, $marketContext),
            'weekly' => new WeeklyPredictor($production, $consumption, $marketContext),
            default => throw new \InvalidArgumentException("Periodo no soportado: {$period}"),
        };
    }

    public function createAll(float $production = 0.0, float $consumption = 0.0, array $marketContext = []): array
    {
        return array_map(
            fn(string $period) => $this->create($period, $production, $consumption, $marketContext),
            self::TYPES
        );
    }
}
```

**Estado real del mercado** (`MarketService::getMarketContext()`), calculado con las ofertas y transacciones reales:

```php
public function getMarketContext(): array
{
    $active = array_filter($this->offers, fn($o) => $o->availableKwh > 0);
    $activeCount = count($active);
    $totalAvailable = array_sum(array_map(fn($o) => $o->availableKwh, $active));
    $avgPrice = $activeCount > 0
        ? round(array_sum(array_map(fn($o) => $o->pricePerKwh, $active)) / $activeCount, 2)
        : 0.0;

    return [
        'totalOffers' => count($this->offers),
        'activeOffers' => $activeCount,
        'totalAvailableKwh' => round($totalAvailable, 2),
        'avgPricePerKwh' => $avgPrice,
        'transactionCount' => $this->transactionCount,
    ];
}
```

**Uso en `EnergyController`** (endpoint `GET /api/energy/predictions?production=&consumption=`):

```php
public function getPredictions(Request $request): JsonResponse
{
    $production = (float) $request->query('production', 0);
    $consumption = (float) $request->query('consumption', 0);

    // Contexto REAL del mercado (ofertas, kWh, precio promedio, transacciones)
    $marketContext = $this->market->getMarketContext();

    $predictions = array_map(
        fn(AbstractPredictor $predictor) => $predictor->predict(),
        $this->predictorFactory->createAll($production, $consumption, $marketContext)
    );

    $this->logger->log("Consulta de predicciones (produccion: {$production}, consumo: {$consumption})");

    return response()->json($predictions);
}
```

**Ejemplo de respuesta** — la predicción incluye la `action` y el `market` real:

```json
[
  {
    "period": "daily",
    "productionEstimate": 18,
    "consumptionEstimate": 10,
    "surplusEstimate": 8,
    "deficitEstimate": 0,
    "action": "publish",
    "recommendation": "Se estima un excedente de 8 kWh. Puedes venderlo: el mercado promedia 10900 COP/kWh.",
    "market": {
      "totalOffers": 5,
      "activeOffers": 5,
      "totalAvailableKwh": 170,
      "avgPricePerKwh": 10900,
      "transactionCount": 1
    }
  }
]
```

---

## 8. `Predictor` — Frontend

**Archivo:** `frontend/src/patterns/template/Predictor.ts`

**En qué consiste dentro del proyecto:** Clase base abstracta de TypeScript con **métodos abstractos** (`getPeriod`, `getProductionEstimate`, `getConsumptionEstimate`, `getDescription`, `getColor`) y un **método plantilla** `predict()` que calcula excedente/déficit, determina la **acción** (`publish`/`buy`/`none`) y genera la recomendación usando la producción/consumo y el **contexto real del mercado** que recibe en el constructor. Las subclases `DailyPredictor` y `WeeklyPredictor` interpretan esos datos (diario usa el valor directo, semanal lo escala ×6).

El componente `PredictionPanel` está **ligado al sistema**: muestra una barra con el **estado real del mercado** (ofertas activas, kWh disponibles, precio promedio y transacciones, obtenidas del backend), expone un **formulario de producción/consumo** y genera acciones **reales**:
- **"Publicar excedente"** (acción `publish`): crea una oferta real en el mercado con el excedente estimado al precio promedio real.
- **"Comprar energia"** (acción `buy`): compra energía real de la oferta más barata disponible para cubrir el déficit estimado.

Tras una acción, el dashboard y las predicciones se actualizan automáticamente. Al pulsar **"Calcular local"** ejecuta el patrón en el **frontend (TypeScript)**; al pulsar **"Consultar backend"** llama al endpoint `GET /api/energy/predictions` para que el patrón se ejecute en el **backend (PHP)**.

**Diagrama UML:**

```
┌───────────────────────────────────────────────┐
│          «Clase Base Abstracta»               │
│             Predictor                         │
├───────────────────────────────────────────────┤
│ # production : number         (datos usuario) │
│ # consumption : number        (datos usuario) │
│ # marketContext : MarketContext(estado real)  │
│ # getPeriod() : string            (abstract)  │
│ # getProductionEstimate():number  (abstract)  │
│ # getConsumptionEstimate():number (abstract)  │
│ # getDescription() : string       (abstract)  │
│ # getColor() : string             (abstract)  │
│                                               │
│ # getAction(number): string  publish/buy/none │
│ # buildRecommendation(number): string         │
│ + predict() : Prediction         (plantilla)  │
└───────────────────────▲───────────────────────┘
                        │  extienden
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│  DailyPredictor  │          │  WeeklyPredictor │
│  prod: real      │          │  prod: real×6    │
│  cons: real      │          │  cons: real×6    │
│  color:#f39c12   │          │  color:#3498db    │
└──────────────────┘          └──────────────────┘
        │  usan                               │  usan
        ▼                                     ▼
┌────────────────────────────────────────────────────────────┐
│          PredictionPanel (React) — ligado al sistema        │
│  • Barra con estado real del mercado          │
│  • Formulario producción/consumo                            │
│  • "Calcular local" : Predictor(...).predict() (TS)         │
│  • "Consultar backend" : GET /api/energy/predictions (PHP)  │
│  • Acción publish → createOffer (éxito real en el mercado)  │
│  • Acción buy    → purchaseOffer (transacción real)         │
└────────────────────────────────────────────────────────────┘
```

**Código completo de la clase abstracta** (`Predictor.ts`):

```typescript
export interface MarketContext {
  totalOffers: number;
  activeOffers: number;
  totalAvailableKwh: number;
  avgPricePerKwh: number;
  transactionCount: number;
}

export interface Prediction {
  period: string;
  description: string;
  color: string;
  productionEstimate: number;
  consumptionEstimate: number;
  surplusEstimate: number;
  deficitEstimate: number;
  action: 'publish' | 'buy' | 'none';
  recommendation: string;
  market: MarketContext;
}

export abstract class Predictor {
  protected production: number;
  protected consumption: number;
  protected marketContext: MarketContext;

  constructor(production = 0, consumption = 0, marketContext: MarketContext = emptyMarket()) {
    this.production = production;
    this.consumption = consumption;
    this.marketContext = marketContext;
  }

  abstract getPeriod(): string;
  abstract getProductionEstimate(): number;
  abstract getConsumptionEstimate(): number;
  abstract getDescription(): string;
  abstract getColor(): string;

  predict(): Prediction {
    const production = this.getProductionEstimate();
    const consumption = this.getConsumptionEstimate();
    const surplus = production - consumption;

    return {
      period: this.getPeriod(),
      description: this.getDescription(),
      color: this.getColor(),
      productionEstimate: round(production),
      consumptionEstimate: round(consumption),
      surplusEstimate: round(Math.max(0, surplus)),
      deficitEstimate: round(Math.max(0, -surplus)),
      action: this.getAction(surplus),
      recommendation: this.buildRecommendation(surplus),
      market: this.marketContext,
    };
  }

  protected getAction(surplus: number): 'publish' | 'buy' | 'none' {
    if (surplus > 0) return 'publish';
    if (surplus < 0) return 'buy';
    return 'none';
  }

  protected buildRecommendation(surplus: number): string {
    const avgPrice = round(this.marketContext.avgPricePerKwh);
    const available = this.marketContext.totalAvailableKwh;
    const activeOffers = this.marketContext.activeOffers;

    if (surplus > 0) {
      return `Se estima un excedente de ${surplus} kWh. Puedes venderlo: el mercado promedia ${avgPrice} COP/kWh.`;
    }
    if (surplus < 0) {
      return `Se estima un deficit de ${Math.abs(surplus)} kWh. El mercado dispone de ${available} kWh en ${activeOffers} ofertas activas; compra para cubrir tu consumo.`;
    }
    return 'Tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.';
  }
}

function emptyMarket(): MarketContext {
  return {
    totalOffers: 0,
    activeOffers: 0,
    totalAvailableKwh: 0,
    avgPricePerKwh: 0,
    transactionCount: 0,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
```

**Subclases concretas** (`DailyPredictor.ts`, `WeeklyPredictor.ts`):

```typescript
// DailyPredictor.ts
export class DailyPredictor extends Predictor {
  constructor(production = 0, consumption = 0, marketContext?: MarketContext) {
    super(production, consumption, marketContext);   // recibe el estado real del mercado
  }
  getPeriod(): string { return 'daily'; }
  getProductionEstimate(): number {
    return this.production > 0 ? this.production : 18;   // dato real del usuario
  }
  getConsumptionEstimate(): number {
    return this.consumption > 0 ? this.consumption : 10;  // dato real del usuario
  }
  getDescription(): string {
    return 'Prediccion diaria basada en la produccion y consumo registrados en el ultimo periodo.';
  }
  getColor(): string { return '#f39c12'; }
}

// WeeklyPredictor.ts
export class WeeklyPredictor extends Predictor {
  constructor(production = 0, consumption = 0, marketContext?: MarketContext) {
    super(production, consumption, marketContext);   // recibe el estado real del mercado
  }
  getPeriod(): string { return 'weekly'; }
  getProductionEstimate(): number {
    return this.production > 0 ? this.production * 6 : 21.5;  // escala a la semana
  }
  getConsumptionEstimate(): number {
    return this.consumption > 0 ? this.consumption * 6 : 13;  // escala a la semana
  }
  getDescription(): string {
    return 'Prediccion semanal basada en el promedio ponderado de produccion y consumo de la ultima semana.';
  }
  getColor(): string { return '#3498db'; }
}
```

**Uso ligado al sistema en `PredictionPanel` (React):**

```tsx
// Cálculo local (patrón ejecutado en el frontend con TypeScript)
const handleLocalUpdate = () => {
  const market = predictions[0]?.market;   // estado REAL del mercado
  const local = [
    new DailyPredictor(production, consumption, market),
    new WeeklyPredictor(production, consumption, market),
  ].map((predictor) => predictor.predict());   // método plantilla
  setPredictions(local);
};

// Consulta al backend (patrón ejecutado en el servidor con PHP)
const handleBackendPredict = async () => {
  const data = await api.getPredictions(production, consumption);
  setPredictions(data);
};

// Acción REAL según la predicción:
//   action === 'publish' → crea una oferta con el excedente al precio promedio del mercado
const handlePublish = async (prediction) => {
  const result = await api.createOffer({
    producerName,
    totalKwh: prediction.surplusEstimate,
    pricePerKwh: prediction.market.avgPricePerKwh,
    energyType,
    description: `Excedente estimado por prediccion ${prediction.period}`,
  });
  alert(`Oferta #${result.id} publicada.`);
  onSystemChanged?.();           // refresca el dashboard
  await loadFromBackend(...);    // refresca la predicción (mercado actualizado)
};

//   action === 'buy' → compra la energía que falta de la oferta más barata
const handleBuy = async (prediction) => {
  const offers = await api.getAvailableOffers();
  const cheapest = [...offers].sort((a, b) => a.pricePerKwh - b.pricePerKwh)[0];
  const result = await api.purchaseOffer(cheapest.id!, Math.min(prediction.deficitEstimate, cheapest.availableKwh));
  alert(result.message);
  onSystemChanged?.();           // refresca el dashboard
  await loadFromBackend(...);    // refresca la predicción (mercado actualizado)
};
```

---

# Patrón Builder

## ¿Qué es dentro del proyecto?

El **Builder** se usa en el proyecto para **construir ofertas de excedente energético paso a paso**, separando la construcción de la representación final. Se aplica directamente al **subsistema de compra y venta de excedentes energéticos** y al objetivo de **gestionar y publicar los excedentes**: en lugar de asignar campo por campo una oferta en el momento de publicarla, un **builder** (`EnergyOfferBuilder`) expone pasos (`setProducer`, `setEnergyType`, `setQuantity`, `setPricePerKwh`, `setDescription`) y un **director** (`OfferDirector`) orquesta esos pasos para producir distintas variantes de oferta:

- `buildFromRequest(...)` → oferta **personalizada** con los datos exactos del productor.
- `buildExpressOffer(...)` → oferta **exprés** en la que el director completa los pasos faltantes (precio, descripción) con valores por defecto tomados de `ConfigService`.

La construcción queda **visible para el usuario**: en el frontend la oferta se define en un asistente (paso 1 productor, paso 2 tipo, paso 3 cantidad, paso 4 precio, paso 5 descripción, paso 6 construir) y el director la entrega construida con los datos completos. En el backend, `MarketService` delega la creación de ofertas en el director/builder, e integra internamente el **Factory Method** (`EnergySourceFactory`) para validar y normalizar el tipo de energía, cumpliendo los objetivos de **clasificar los tipos de energía** y de **comprar/vender excedentes**.

**Implementaciones actuales (2):**

- `EnergyOfferBuilder` + `OfferDirector` — Backend (PHP)
- `EnergyOfferBuilder` + `OfferDirector` — Frontend (TypeScript)

---

## 9. `EnergyOfferBuilder` / `OfferDirector` — Backend

**Archivo:** `backend-laravel/app/Patterns/Builders/EnergyOfferBuilder.php` y `backend-laravel/app/Patterns/Builders/OfferDirector.php`

**En qué consiste dentro del proyecto:** `EnergyOfferBuilder` es el builder concreto que construye una `EnergyOffer` paso a paso (valida cantidad y precio, y delega la validación del tipo de energía en `EnergySourceFactory`). `OfferDirector` es el director que orquesta los pasos para producir dos variantes: la oferta personalizada (`buildFromRequest`) y la oferta exprés (`buildExpressOffer`), reutilizando la configuración central de `ConfigService`. `MarketService` usa el director al registrar ofertas y expone el endpoint `POST /api/energy/offers/express` para la variante exprés.

**Diagrama UML:**

```
┌──────────────────────────────────────────────┐
│                «Director»                    │
│               OfferDirector                  │
├──────────────────────────────────────────────┤
│ - builder : EnergyOfferBuilder               │
├──────────────────────────────────────────────┤
│ + buildFromRequest(array) : EnergyOffer      │
│ + buildExpressOffer(str,float,str,str)       │
│        : EnergyOffer                         │
└──────────────────┬───────────────────────────┘
                   │  orquesta
                   ▼
┌──────────────────────────────────────────────┐
│            «Builder»                         │
│         EnergyOfferBuilder                   │
├──────────────────────────────────────────────┤
│ - offer : EnergyOffer                        │
├──────────────────────────────────────────────┤
│ + reset() : self                             │
│ + setProducer(string) : self                 │
│ + setEnergyType(string) : self  →Factory     │
│ + setQuantity(float) : self                  │
│ + setPricePerKwh(float) : self               │
│ + setDescription(string) : self              │
│ + build() : EnergyOffer                      │
└──────────────────┬───────────────────────────┘
                   │  produce
                   ▼
┌──────────────────────────────────────────────┐
│            «Producto»                        │
│           EnergyOffer  (App\Models)          │
│  producerName · energyType · totalKwh        │
│  availableKwh · pricePerKwh · description    │
│  id · createdAt                              │
└──────────────────────────────────────────────┘
         ▲                    ▲
         │  usa               │  usa
┌──────────────────┐  ┌────────────────────────┐
│  MarketService   │  │ EnergySourceFactory    │
│  (Singleton)     │  │ (+ ConfigService)      │
└──────────────────┘  └────────────────────────┘
```

**Código completo del builder** (`EnergyOfferBuilder.php`):

```php
<?php

namespace App\Patterns\Builders;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;
use App\Patterns\Factories\EnergySourceFactory;

class EnergyOfferBuilder
{
    private EnergyOffer $offer;

    public function __construct()
    {
        $this->reset();
    }

    public function reset(): self
    {
        $this->offer = new EnergyOffer();
        return $this;
    }

    public function setProducer(string $producerName): self
    {
        $this->offer->producerName = trim($producerName);
        return $this;
    }

    public function setEnergyType(string $type): self
    {
        // Usa el Factory Method interno para validar y normalizar el tipo.
        $source = (new EnergySourceFactory())->create($type);
        $this->offer->energyType = $source->getType();
        return $this;
    }

    public function setQuantity(float $totalKwh): self
    {
        $maxKwh = (float) ConfigService::getInstance()->get('maxOfferKwh');

        if ($totalKwh <= 0) {
            throw new \InvalidArgumentException('La cantidad de energia debe ser mayor a cero');
        }
        if ($totalKwh > $maxKwh) {
            throw new \InvalidArgumentException("La cantidad no puede superar {$maxKwh} kWh");
        }

        $this->offer->totalKwh = $totalKwh;
        $this->offer->availableKwh = $totalKwh;
        return $this;
    }

    public function setPricePerKwh(float $price): self
    {
        if ($price < 0) {
            throw new \InvalidArgumentException('El precio no puede ser negativo');
        }
        $this->offer->pricePerKwh = $price;
        return $this;
    }

    public function setDescription(string $description): self
    {
        $this->offer->description = $description;
        return $this;
    }

    public function build(): EnergyOffer
    {
        $built = $this->offer;
        $this->reset();
        return $built;
    }
}
```

**Código completo del director** (`OfferDirector.php`):

```php
<?php

namespace App\Patterns\Builders;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;

class OfferDirector
{
    public function __construct(private EnergyOfferBuilder $builder) {}

    public function buildFromRequest(array $data): EnergyOffer
    {
        return $this->builder
            ->reset()
            ->setProducer($data['producerName'])
            ->setEnergyType($data['energyType'] ?? '')
            ->setQuantity((float) $data['totalKwh'])
            ->setPricePerKwh((float) $data['pricePerKwh'])
            ->setDescription($data['description'] ?? '')
            ->build();
    }

    public function buildExpressOffer(string $producerName, float $totalKwh, string $type, string $description = ''): EnergyOffer
    {
        $defaultPrice = (float) ConfigService::getInstance()->get('defaultPricePerKwh');

        return $this->builder
            ->reset()
            ->setProducer($producerName)
            ->setEnergyType($type)
            ->setQuantity($totalKwh)
            ->setPricePerKwh($defaultPrice)
            ->setDescription($description ?: 'Oferta expres construida por el Director con el precio por defecto del mercado')
            ->build();
    }
}
```

**Uso integrado en `MarketService`** (`registerOffer` usa el director con la solicitud validada; `registerExpressOffer` crea la variante exprés):

```php
public function registerOffer(array $data): EnergyOffer
{
    // Patron Builder: el Director orquesta a EnergyOfferBuilder para
    // construir la oferta paso a paso.
    $offer = (new OfferDirector(new EnergyOfferBuilder()))
        ->buildFromRequest($data);

    $offer->id = $this->nextId++;
    $offer->createdAt = now()->toIso8601String();

    $this->offers[] = $offer;
    $this->save();
    return $offer;
}

public function registerExpressOffer(array $data): EnergyOffer
{
    // Variante: el Director completa los pasos con valores por defecto
    // (precio tomado de ConfigService) a partir de solo 3 datos.
    $offer = (new OfferDirector(new EnergyOfferBuilder()))
        ->buildExpressOffer($data['producerName'], (float) $data['totalKwh'], $data['energyType']);

    $offer->id = $this->nextId++;
    $offer->createdAt = now()->toIso8601String();

    $this->offers[] = $offer;
    $this->save();
    return $offer;
}
```

**Endpoint del director (variante exprés)** (`EnergyController::createExpressOffer`, ruta `POST /api/energy/offers/express`):

```php
public function createExpressOffer(Request $request): JsonResponse
{
    $data = $request->validate([
        'producerName' => 'required|string',
        'totalKwh' => 'required|numeric|min:1',
        'energyType' => 'required|string|in:solar,wind,hydro',
    ]);

    try {
        $offer = $this->market->registerExpressOffer($data);
    } catch (\InvalidArgumentException $e) {
        return response()->json(['error' => $e->getMessage()], 422);
    }

    $this->logger->incrementOffers();
    $this->logger->log("Oferta expres creada por {$data['producerName']} ({$offer->energyType})");

    return response()->json($offer->toArray(), 201);
}
```

**Ejemplo de respuesta de la oferta exprés** (el precio se completa con el valor por defecto de `ConfigService`):

```bash
curl -X POST http://localhost:8000/api/energy/offers/express \
  -H "Content-Type: application/json" \
  -d '{"producerName":"Maria Lopez","totalKwh":8,"energyType":"wind"}'
```

```json
{
  "id": 7,
  "producerName": "Maria Lopez",
  "totalKwh": 8,
  "availableKwh": 8,
  "pricePerKwh": 500,
  "description": "Oferta expres construida por el Director con el precio por defecto del mercado",
  "energyType": "wind",
  "createdAt": "2026-09-13T16:25:10+00:00"
}
```

---

## 10. `EnergyOfferBuilder` / `OfferDirector` — Frontend

**Archivo:** `frontend/src/patterns/builder/EnergyOfferBuilder.ts` y `frontend/src/patterns/builder/OfferDirector.ts`

**En qué consiste dentro del proyecto:** Clase de TypeScript equivalente al builder del backend. `EnergyOfferBuilder` construye la oferta paso a paso (`reset`, `setProducer`, `setEnergyType`, `setQuantity`, `setPricePerKwh`, `setDescription`) y expone `snapshot()` para obtener una copia del estado actual. `OfferDirector` orquesta los pasos y genera las mismas dos variantes que el backend (`buildFromRequest` y `buildExpressOffer`).

El componente **`CreateOffer` está ligado al sistema**: organiza el formulario como un **asistente de 6 pasos** con los datos de la oferta. Al publicar:
- **"Construir y publicar oferta"** usa el director (`buildFromRequest`) para construir la oferta con los datos del asistente y la envía a `POST /api/energy/offers`.
- **"Publicar oferta expres"** llama al endpoint `POST /api/energy/offers/express` para que el director del backend complete el precio con `ConfigService`.

`PredictionPanel` también usa el director (`buildFromRequest`) al convertir un **excedente estimado por predicción** en una **oferta real** del mercado.

**Diagrama UML:**

```
┌──────────────────────────────────────────────┐
│              «Director»                      │
│             OfferDirector                    │
├──────────────────────────────────────────────┤
│ - builder : EnergyOfferBuilder               │
├──────────────────────────────────────────────┤
│ + buildFromRequest(OfferData) : EnergyOffer  │
│ + buildExpressOffer(str,num,str,str)         │
│        : EnergyOffer                         │
└──────────────────┬───────────────────────────┘
                   │  orquesta
                   ▼
┌──────────────────────────────────────────────┐
│             «Builder»                        │
│        EnergyOfferBuilder                    │
├──────────────────────────────────────────────┤
│ - offer : EnergyOffer                        │
├──────────────────────────────────────────────┤
│ + reset() : this                             │
│ + setProducer(string) : this                 │
│ + setEnergyType(string) : this               │
│ + setQuantity(number) : this                 │
│ + setPricePerKwh(number) : this              │
│ + setDescription(string) : this              │
│ + snapshot() : EnergyOffer                   │
│ + build() : EnergyOffer                      │
└──────────────────┬───────────────────────────┘
                   │  produce
                   ▼
┌──────────────────────────────────────────────┐
│          «Producto / Interfaz»               │
│   EnergyOffer (energy-api.service.ts)        │
│  producerName · energyType · totalKwh        │
│  availableKwh · pricePerKwh · description    │
└──────────────────────────────────────────────┘
         ▲                          ▲
         │  usa                      │  usa
┌──────────────────┐       ┌────────────────────────┐
│   CreateOffer     │       │    PredictionPanel     │
│  (asistente 6    │       │  (publica excedente     │
│   pasos)         │       │   estimado)             │
└──────────────────┘       └────────────────────────┘
```

**Código completo del builder** (`EnergyOfferBuilder.ts`):

```typescript
import type { EnergyOffer } from '../singleton/energy-api.service';

export const SUPPORTED_ENERGY_TYPES = ['solar', 'wind', 'hydro'] as const;

export class EnergyOfferBuilder {
  private offer!: EnergyOffer;

  constructor() {
    this.reset();
  }

  reset(): this {
    this.offer = {
      producerName: '',
      totalKwh: 0,
      availableKwh: 0,
      pricePerKwh: 0,
      description: '',
      energyType: '',
    };
    return this;
  }

  setProducer(producerName: string): this {
    this.offer.producerName = producerName.trim();
    return this;
  }

  setEnergyType(type: string): this {
    const normalized = type.toLowerCase();
    if (!(SUPPORTED_ENERGY_TYPES as readonly string[]).includes(normalized)) {
      throw new Error(`Tipo de energia no soportado: ${type}`);
    }
    this.offer.energyType = normalized;
    return this;
  }

  setQuantity(totalKwh: number): this {
    if (!Number.isFinite(totalKwh) || totalKwh <= 0) {
      throw new Error('La cantidad de energia debe ser mayor a cero');
    }
    this.offer.totalKwh = totalKwh;
    this.offer.availableKwh = totalKwh;
    return this;
  }

  setPricePerKwh(price: number): this {
    if (!Number.isFinite(price) || price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.offer.pricePerKwh = price;
    return this;
  }

  setDescription(description: string): this {
    this.offer.description = description;
    return this;
  }

  snapshot(): EnergyOffer {
    return { ...this.offer };
  }

  build(): EnergyOffer {
    const built = this.snapshot();
    this.reset();
    return built;
  }
}
```

**Código completo del director** (`OfferDirector.ts`):

```typescript
import { EnergyOfferBuilder } from './EnergyOfferBuilder';
import type { EnergyOffer } from '../singleton/energy-api.service';

const DEFAULT_PRICE_PER_KWH = 500; // espejo de ConfigService (backend)

interface OfferData {
  producerName: string;
  totalKwh: number;
  pricePerKwh: number;
  energyType?: string;
  description?: string;
}

export class OfferDirector {
  constructor(private builder: EnergyOfferBuilder) {}

  buildFromRequest(data: OfferData): EnergyOffer {
    return this.builder
      .reset()
      .setProducer(data.producerName)
      .setEnergyType(data.energyType ?? 'solar')
      .setQuantity(data.totalKwh)
      .setPricePerKwh(data.pricePerKwh)
      .setDescription(data.description ?? '')
      .build();
  }

  buildExpressOffer(
    producerName: string,
    totalKwh: number,
    energyType: string,
    description = ''
  ): EnergyOffer {
    return this.builder
      .reset()
      .setProducer(producerName)
      .setEnergyType(energyType)
      .setQuantity(totalKwh)
      .setPricePerKwh(DEFAULT_PRICE_PER_KWH)
      .setDescription(description || 'Oferta expres construida por el Director con el precio por defecto del mercado')
      .build();
  }
}
```

**Uso ligado al sistema en `CreateOffer` (asistente de 6 pasos):**

```tsx
// Con los datos del asistente, el Director construye la oferta
const buildCustomOffer = () =>
  new OfferDirector(new EnergyOfferBuilder()).buildFromRequest({
    producerName: producerName.trim(),
    totalKwh: qty,
    pricePerKwh: price,
    energyType: selectedEnergyType!,
    description,
  });

// Publicar: el Director entrega la oferta construida
const handlePublish = async () => {
  const offer = buildCustomOffer();
  const result = await api.createOffer(offer);  // POST /api/energy/offers
  alert(`Oferta #${result.id} publicada correctamente.`);
};

// Variante expres: el Director del backend completa el precio por defecto
const handlePublishExpress = async () => {
  const result = await api.createExpressOffer({
    producerName: producerName.trim(),
    totalKwh: qty,
    energyType: selectedEnergyType!,
  });  // POST /api/energy/offers/express
  alert(`Oferta expres #${result.id} publicada.`);
};
```

**Uso ligado al sistema en `PredictionPanel`** (el excedente estimado por predicción se convierte en una oferta real):

```tsx
const handlePublish = async (prediction: Prediction) => {
  const offer = new OfferDirector(new EnergyOfferBuilder()).buildFromRequest({
    producerName,
    totalKwh: prediction.surplusEstimate,
    pricePerKwh: prediction.market.avgPricePerKwh || 500,
    energyType,
    description: `Excedente estimado por prediccion ${prediction.period}`,
  });
  const result = await api.createOffer(offer);
};
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
| POST | `/api/energy/offers` | Crear una oferta de excedente (construida con el patrón Builder) |
| POST | `/api/energy/offers/express` | Crear una oferta exprés con el precio por defecto (Builder — variante del Director) |
| GET | `/api/energy/offers` | Consultar ofertas disponibles |
| POST | `/api/energy/offers/{id}/purchase` | Comprar energía de una oferta |
| GET | `/api/energy/metrics` | Ver métricas del mercado |
| GET | `/api/energy/source-catalog` | Ver catálogo de fuentes de energía (Factory Method) |
| GET | `/api/energy/predictions` | Ver predicciones de producción/consumo (Abstract Method) ligadas al estado real del mercado. Acepta `?production=&consumption=` |

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

# Crear oferta expres (Builder — el Director completa el precio por defecto)
curl -X POST http://localhost:8000/api/energy/offers/express \
  -H "Content-Type: application/json" \
  -d '{"producerName": "Maria Lopez", "totalKwh": 8, "energyType": "wind"}'

# Consultar ofertas
curl http://localhost:8000/api/energy/offers

# Comprar energía
curl -X POST http://localhost:8000/api/energy/offers/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"kwh": 5}'

# Consultar catálogo de fuentes (Factory Method)
curl http://localhost:8000/api/energy/source-catalog

# Consultar predicciones de producción y consumo (Abstract Method).
# Sin parámetros usa valores históricos de prueba:
curl http://localhost:8000/api/energy/predictions

# Con datos reales del usuario (production y consumption en kWh):
curl "http://localhost:8000/api/energy/predictions?production=30&consumption=50"
```

## Proximo Patron (Semana 3)

*Proximamente se implementara el siguiente patron de diseno...*
