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
- [11. `OfferPrototype` / `PrototypeRegistry` (Prototype — Backend)](#11-offerprototype--prototyperegistry--backend)
- [12. `OfferPrototype` / `PrototypeRegistry` (Prototype — Frontend)](#12-offerprototype--prototyperegistry--frontend)
- [13. `DeviceGateway` / `DeviceMonitorService` (Adapter — Backend)](#13-devicegateway--devicemonitorservice--backend)
- [14. `DeviceGateway` / `DevicePanel` (Adapter — Frontend)](#14-devicegateway--devicepanel--frontend)
- [15. `EnergyBill` / `CurrencyBridge` (Bridge — Backend)](#15-energybill--currencybridge--backend)
- [16. `EnergyBill` / `CurrencyBridge` (Bridge — Frontend)](#16-energybill--currencybridge--frontend)
- [17. `BasicOffer` / `OfferDecorator` (Decorator — Backend)](#17-basicoffer--offerdecorator--offerpricingservice--backend)
- [18. `BasicOffer` / `OfferDecorator` (Decorator — Frontend)](#18-basicoffer--offerdecorator--offerpricingservice--frontend)
- [19. `EnergyBundle` / `OfferLeaf` (Composite — Backend)](#19-energybundle--offerleaf--bundleservice--backend)
- [20. `EnergyBundle` / `OfferLeaf` (Composite — Frontend)](#20-energybundle--offerleaf--bundleservice--frontend)
- [21. `EnergyPlatformFacade` (Facade — Backend)](#21-energyplatformfacade--backend)
- [22. `PlatformFacade` (Facade — Frontend)](#22-platformfacade--frontend)
- [23. `EnergySourceFlyweightFactory` (Flyweight — Backend)](#23-energysourceflyweightfactory--backend)
- [24. `EnergyTypeFlyweightFactory` (Flyweight — Frontend)](#24-energytypeflyweightfactory--frontend)
- [25. `MarketProxy` (Proxy — Backend)](#25-marketproxy--backend)
- [26. `EnergyApiProxy` (Proxy — Frontend)](#26-energyapiproxy--frontend)

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
| Patrones de diseño | Singleton, Factory Method, Abstract Method, Builder, Prototype, Adapter, Bridge, Decorator, Composite, Facade, Flyweight, Proxy |

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
| 11 | [Prototype](#11-offerprototype--prototyperegistry--backend) · `OfferPrototype` + `PrototypeRegistry` | Backend | [Ir](#11-offerprototype--prototyperegistry--backend) |
| 12 | [Prototype](#12-offerprototype--prototyperegistry--frontend) · `OfferPrototype` + `PrototypeRegistry` | Frontend | [Ir](#12-offerprototype--prototyperegistry--frontend) |
| 13 | [Adapter](#13-devicegateway--devicemonitorservice--backend) · `DeviceGateway` + `DeviceMonitorService` | Backend | [Ir](#13-devicegateway--devicemonitorservice--backend) |
| 14 | [Adapter](#14-devicegateway--devicepanel--frontend) · `DeviceGateway` + `DevicePanel` | Frontend | [Ir](#14-devicegateway--devicepanel--frontend) |
| 15 | [Bridge](#15-energybill--currencybridge--backend) · `EnergyBill` + `CurrencyBridge` | Backend | [Ir](#15-energybill--currencybridge--backend) |
| 16 | [Bridge](#16-energybill--currencybridge--frontend) · `EnergyBill` + `CurrencyBridge` | Frontend | [Ir](#16-energybill--currencybridge--frontend) |
| 17 | [Decorator](#17-basicoffer--offerdecorator--offerpricingservice--backend) · `OfferPricingService` | Backend | [Ir](#17-basicoffer--offerdecorator--offerpricingservice--backend) |
| 18 | [Decorator](#18-basicoffer--offerdecorator--offerpricingservice--frontend) · `OfferPricingService` | Frontend | [Ir](#18-basicoffer--offerdecorator--offerpricingservice--frontend) |
| 19 | [Composite](#19-energybundle--offerleaf--bundleservice--backend) · `EnergyBundle` + `OfferLeaf` | Backend | [Ir](#19-energybundle--offerleaf--bundleservice--backend) |
| 20 | [Composite](#20-energybundle--offerleaf--bundleservice--frontend) · `EnergyBundle` + `OfferLeaf` | Frontend | [Ir](#20-energybundle--offerleaf--bundleservice--frontend) |
| 21 | [Facade](#21-energyplatformfacade--backend) · `EnergyPlatformFacade` | Backend | [Ir](#21-energyplatformfacade--backend) |
| 22 | [Facade](#22-platformfacade--frontend) · `PlatformFacade` | Frontend | [Ir](#22-platformfacade--frontend) |
| 23 | [Flyweight](#23-energysourceflyweightfactory--backend) · `EnergySourceFlyweightFactory` | Backend | [Ir](#23-energysourceflyweightfactory--backend) |
| 24 | [Flyweight](#24-energytypeflyweightfactory--frontend) · `EnergyTypeFlyweightFactory` | Frontend | [Ir](#24-energytypeflyweightfactory--frontend) |
| 25 | [Proxy](#25-marketproxy--backend) · `MarketProxy` | Backend | [Ir](#25-marketproxy--backend) |
| 26 | [Proxy](#26-energyapiproxy--frontend) · `EnergyApiProxy` | Frontend | [Ir](#26-energyapiproxy--frontend) |

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

# Patrón Prototype

## ¿Qué es dentro del proyecto?

El **Prototype** se usa en el proyecto para **clonar ofertas de excedente energético en lugar de construirlas desde cero**. Una oferta (o una plantilla de oferta) actúa como un **prototipo**; en vez de repetir el proceso de publicación, se le pide que **se copie a sí misma** (`copy()` / `clone()`) y se entrega una **copia independiente**: nuevo `id`, `availableKwh` reiniciado al total y fecha de creación vacía. Modificar el clon **no afecta al prototipo original**.

Se aplica directamente al **subsistema de compra y venta de excedentes energéticos** y a los objetivos de **gestionar los excedentes disponibles** y **clasificar los tipos de energía**: un productor que publica ofertas similares con frecuencia puede **duplicar una oferta existente** o partir de una **plantilla** (prototipo por tipo de energía), ahorrándose capturar campo por campo los mismos datos.

El patrón está **ligado al resto del sistema** e integra otros patrones:

- `OfferPrototype` usa `clone` de PHP / objeto copiado en TypeScript para clonar el modelo `EnergyOffer`.
- `PrototypeRegistry` (Singleton) mantiene las plantillas y las siembra con el **Factory Method** (`EnergySourceFactory`) y `ConfigService`.
- La clonación se expone en endpoints reales: `POST /api/energy/offers/{id}/clone` (duplicar oferta existente) y `POST /api/energy/offers/clone-template` (crear a partir de una plantilla).

**Implementaciones actuales (2):**

- `Prototype` + `OfferPrototype` + `PrototypeRegistry` — Backend (PHP)
- `Prototype` + `OfferPrototype` + `PrototypeRegistry` — Frontend (TypeScript)

---

## 11. `OfferPrototype` / `PrototypeRegistry` — Backend

**Archivo:** `backend-laravel/app/Patterns/Prototypes/Prototype.php`, `backend-laravel/app/Patterns/Prototypes/OfferPrototype.php` y `backend-laravel/app/Patterns/Prototypes/PrototypeRegistry.php`

**En qué consiste dentro del proyecto:** La interfaz `Prototype` declara `copy()`. `OfferPrototype` envuelve una `EnergyOffer` y su `copy()` devuelve una **clonación independiente** (nuevo objeto con `id = null`, `availableKwh` reiniciado al total y `createdAt` vacío) y expone pasos para personalizar el clon (`setProducer`, `setQuantity`, `setPricePerKwh`, `setDescription`). `PrototypeRegistry` (Singleton) guarda **plantillas base** por tipo de energía (sembradas con `EnergySourceFactory` + `ConfigService`) y `getTemplate($type)` devuelve una **copia** de la plantilla, nunca el prototipo almacenado.

`MarketService` lo integra de dos formas: `cloneOffer($id, $adjustments)` cobra un clon de una **oferta existente** del mercado, y `createOfferFromTemplate($type, $data)` clona una **plantilla** del registro y la personaliza. Los endpoints `POST /api/energy/offers/{id}/clone`, `GET /api/energy/prototype-templates` y `POST /api/energy/offers/clone-template` exponen estas operaciones.

**Diagrama UML:**

```
┌──────────────────────────────────────────────────────┐
│                   «Singleton»                         │
│                PrototypeRegistry                      │
├──────────────────────────────────────────────────────┤
│ - instance : PrototypeRegistry   (única instancia)   │
│ - templates : array               (plantilla por tipo)│
├──────────────────────────────────────────────────────┤
│ - __construct()            (privado)                  │
│ - seedTemplates() : void     (usa Factory Method)     │
│ + getInstance() : PrototypeRegistry                   │
│ + getTemplate(string) : OfferPrototype (devuelve CLON)│
│ + listTemplates() : array                            │
└───────────────────────┬──────────────────────────────┘
                        │  clona
                        ▼
┌───────────────────────────────────────────────┐
│              «Prototype»                      │
│              Prototype  (interface)           │
├───────────────────────────────────────────────┤
│ + copy() : Prototype        (abstract)        │
└───────────────────────────────────────────────┘
         ▲
         │  implementa
┌───────────────────────────────────────────────┐
│            OfferPrototype                     │
├───────────────────────────────────────────────┤
│ - offer : EnergyOffer           (prototipo)   │
├───────────────────────────────────────────────┤
│ + from(EnergyOffer) : self                    │
│ + copy() : Prototype  (clon independiente)    │
│ + setProducer(string) : self                  │
│ + setQuantity(float) : self                   │
│ + setPricePerKwh(float) : self                │
│ + setDescription(string) : self               │
│ + toArray() : array                           │
└──────────────────┬────────────────────────────┘
                   │  envuelve / copia
                   ▼
┌───────────────────────────────────────────────┐
│        «Producto»  EnergyOffer  (App\Models)  │
│  id=NULL · availableKwh=totalKwh · createdAt='│
└───────────────────────────────────────────────┘
         ▲                     ▲
         │  usa                │  usa
┌──────────────────┐   ┌────────────────────────┐
│   MarketService   │   │ Factory Method + Config│
│  cloneOffer()     │   │ (EnergySourceFactory) │
│  createFromTemplate│  └────────────────────────┘
└──────────────────┘
```

**Código completo de la interfaz** (`Prototype.php`):

```php
interface Prototype
{
    public function copy(): Prototype;
}
```

**Código completo del prototipo** (`OfferPrototype.php`):

```php
class OfferPrototype implements Prototype
{
    public function __construct(private EnergyOffer $offer) {}

    public static function from(EnergyOffer $offer): self
    {
        return new self($offer);
    }

    public function getOffer(): EnergyOffer
    {
        return $this->offer;
    }

    public function copy(): Prototype
    {
        // Clonación: se copia el objeto y se reinician los campos de ciclo de
        // vida. El clon es independiente; modificarlo no afecta al original.
        $copy = clone $this->offer;
        $copy->id = null;
        $copy->availableKwh = $copy->totalKwh;
        $copy->createdAt = '';

        return new self($copy);
    }

    public function setProducer(string $producerName): self
    {
        $this->offer->producerName = trim($producerName);
        return $this;
    }

    public function setQuantity(float $totalKwh): self
    {
        if ($totalKwh <= 0) {
            throw new \InvalidArgumentException('La cantidad de energia debe ser mayor a cero');
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

    public function toArray(): array
    {
        return $this->offer->toArray();
    }
}
```

**Código completo del registro de prototipos** (`PrototypeRegistry.php`):

```php
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
```

**Uso integrado en `MarketService`** (clonar oferta existente y clonar plantilla):

```php
public function cloneOffer(int $sourceId, array $adjustments = []): EnergyOffer
{
    $source = null;
    foreach ($this->offers as $offer) {
        if ($offer->id === $sourceId) {
            $source = $offer;
            break;
        }
    }
    if ($source === null) {
        throw new \RuntimeException('Oferta origen no encontrada');
    }

    // Patron Prototype: se clona la oferta origen en lugar de construirla
    // desde cero. Cada clon recibe su propia copia (id y fecha nuevos).
    $clonedPrototype = OfferPrototype::from($source)->copy();

    if (!empty($adjustments['producerName'])) {
        $clonedPrototype->setProducer($adjustments['producerName']);
    }
    if (!empty($adjustments['totalKwh'])) {
        $clonedPrototype->setQuantity((float) $adjustments['totalKwh']);
    }
    if (array_key_exists('pricePerKwh', $adjustments) && $adjustments['pricePerKwh'] !== '' && $adjustments['pricePerKwh'] !== null) {
        $clonedPrototype->setPricePerKwh((float) $adjustments['pricePerKwh']);
    }
    if (!empty($adjustments['description'])) {
        $clonedPrototype->setDescription($adjustments['description']);
    }

    $offer = $clonedPrototype->getOffer();
    $offer->id = $this->nextId++;
    $offer->createdAt = now()->toIso8601String();

    $this->offers[] = $offer;
    $this->save();
    return $offer;
}

public function createOfferFromTemplate(string $type, array $data): EnergyOffer
{
    // Patron Prototype: se clona una plantilla registrada en el
    // PrototypeRegistry (creada con el Factory Method) y se personaliza.
    $prototype = PrototypeRegistry::getInstance()->getTemplate($type);

    $prototype
        ->setProducer($data['producerName'])
        ->setQuantity((float) $data['totalKwh']);

    if (!empty($data['pricePerKwh'])) {
        $prototype->setPricePerKwh((float) $data['pricePerKwh']);
    }
    if (!empty($data['description'])) {
        $prototype->setDescription($data['description']);
    }

    $offer = $prototype->getOffer();
    $offer->id = $this->nextId++;
    $offer->createdAt = now()->toIso8601String();

    $this->offers[] = $offer;
    $this->save();
    return $offer;
}
```

**Ejemplo de endpoints** (`EnergyController`):

```php
// POST /api/energy/offers/{id}/clone — duplica una oferta existente
public function cloneOffer(int $id, Request $request): JsonResponse
{
    $adjustments = $request->validate([
        'producerName' => 'nullable|string',
        'totalKwh' => 'nullable|numeric|min:0.1',
        'pricePerKwh' => 'nullable|numeric|min:0',
        'description' => 'nullable|string',
    ]);

    try {
        // Patron Prototype: el backend clona la oferta existente.
        $offer = $this->market->cloneOffer($id, $adjustments);
    } catch (\InvalidArgumentException $e) {
        return response()->json(['error' => $e->getMessage()], 422);
    } catch (\RuntimeException $e) {
        return response()->json(['error' => $e->getMessage()], 404);
    }

    $this->logger->incrementOffers();
    $this->logger->log("Oferta #{$id} clonada con el patron Prototype (nueva oferta #{$offer->id})");

    return response()->json($offer->toArray(), 201);
}

// GET /api/energy/prototype-templates — lista las plantillas del registro
public function getPrototypeTemplates(): JsonResponse
{
    return response()->json(PrototypeRegistry::getInstance()->listTemplates());
}
```

**Ejemplo de respuesta** (clon de la oferta #1 ajustando la cantidad a 10 kWh):

```json
{
  "id": 10,
  "producerName": "Juan Perez",
  "totalKwh": 10,
  "availableKwh": 10,
  "pricePerKwh": 600,
  "description": "Excedente de paneles solares",
  "energyType": "solar",
  "createdAt": "2026-09-13T21:25:31+00:00"
}
```

> El clon recibe un `id` nuevo, `availableKwh` reiniciado al `totalKwh` y la fecha de creación de la clonación. La oferta origen (id 1) **no se modifica**.

---

## 12. `OfferPrototype` / `PrototypeRegistry` — Frontend

**Archivo:** `frontend/src/patterns/prototype/Prototype.ts`, `frontend/src/patterns/prototype/OfferPrototype.ts` y `frontend/src/patterns/prototype/PrototypeRegistry.ts`

**En qué consiste dentro del proyecto:** Equivalente en TypeScript al prototipo del backend. `Prototype` es una interfaz genérica (`copy()`); `OfferPrototype` envuelve una `EnergyOffer`, su `copy()` devuelve una **copia independiente** (spread + reinicio de `id`, `availableKwh` y `createdAt`) y expone los personalizadores (`setProducer`, `setQuantity`, `setPricePerKwh`, `setDescription`); `PrototypeRegistry` usa el cliente HTTP (Singleton) para obtener las plantillas del backend y `cloneTemplate(type)` devuelve un **clon** local de la plantilla seleccionada.

El componente **`OfferPrototypePanel` está ligado al sistema**: muestra un catálogo con las **plantillas** (`GET /api/energy/prototype-templates`), al presionar **"Clonar en el frontend (TypeScript)"** ejecuta el patrón en el navegador (`OfferPrototype.from(template).copy()`) y muestra el clon (id `undefined`, kWh disponibles = total), permitiendo editar productor, cantidad y precio. Al presionar **"Publicar clon"** envía `POST /api/energy/offers/clone-template` para que el **backend (PHP)** clone la plantilla con su propio `PrototypeRegistry`; el dashboard se actualiza automáticamente.

Además, `EnergyDashboard` ofrece el botón **"Duplicar (Prototype)"** en cada oferta, que llama a `POST /api/energy/offers/{id}/clone` para duplicar en el backend una oferta existente.

**Diagrama UML:**

```
┌───────────────────────────────────────────────┐
│                 «Prototype»                   │
│       Prototype<T>  (interface)               │
├───────────────────────────────────────────────┤
│ + copy() : T                 (abstract)       │
└───────────────────────────────────────────────┘
         ▲
         │  implementa
┌───────────────────────────────────────────────┐
│             OfferPrototype                    │
├───────────────────────────────────────────────┤
│ - offer : EnergyOffer          (prototipo)    │
├───────────────────────────────────────────────┤
│ + from(EnergyOffer) : OfferPrototype          │
│ + copy() : OfferPrototype  (clon indepen.)    │
│ + setProducer(string) : this                  │
│ + setQuantity(number) : this                  │
│ + setPricePerKwh(number) : this               │
│ + setDescription(string) : this               │
│ + toOffer() : EnergyOffer                     │
└──────────────────┬────────────────────────────┘
                   │  usa
                   ▼
┌───────────────────────────────────────────────┐
│            PrototypeRegistry                  │
├───────────────────────────────────────────────┤
│ - templates : EnergyOffer[]  (plantillas)     │
├───────────────────────────────────────────────┤
│ + loadTemplates() : PrototypeTemplate[]       │
│ + cloneTemplate(type) : OfferPrototype (CLON) │
└──────┬────────────────────────────────────────┘
       │  usa (Singleton)
       ▼
┌───────────────────────────────────────────────┐
│ EnergyApiService (cliente HTTP — Singleton)   │
│ GET  /prototype-templates                     │
│ POST /offers/clone-template                   │
│ POST /offers/{id}/clone                       │
└───────────────────────────────────────────────┘
         ▲              ▲               ▲
         │              │               │
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│OfferPrototypePanel││ EnergyDashboard││ (interacción   │
│ (clon local TS  │ │ (Duplicar,     ││  usuario)       │
│  + publicar PHP)│ │  clon backend) ││                 │
└────────────────┘ └────────────────┘ └────────────────┘
```

**Código completo del prototipo** (`OfferPrototype.ts`):

```typescript
export class OfferPrototype implements Prototype<OfferPrototype> {
  constructor(private offer: EnergyOffer) {}

  static from(offer: EnergyOffer): OfferPrototype {
    return new OfferPrototype({ ...offer });
  }

  getOffer(): EnergyOffer {
    return this.offer;
  }

  copy(): OfferPrototype {
    // Clonacion: copia independiente del prototipo. Modificar el clon no afecta
    // al original porque no comparten referencia.
    const copy: EnergyOffer = {
      ...this.offer,
      id: undefined,
      availableKwh: this.offer.totalKwh,
      createdAt: undefined,
    };
    return new OfferPrototype(copy);
  }

  setProducer(producerName: string): this {
    this.offer.producerName = producerName.trim();
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

  toOffer(): EnergyOffer {
    return { ...this.offer };
  }
}
```

**Código completo del registro** (`PrototypeRegistry.ts`):

```typescript
export class PrototypeRegistry {
  private templates: EnergyOffer[] = [];

  // El registro usa el cliente HTTP (Singleton) para obtener las plantillas
  // que el backend mantiene en su PrototypeRegistry (PHP).
  async loadTemplates(): Promise<PrototypeTemplate[]> {
    const api = EnergyApiService.getInstance();
    const data = await api.getPrototypeTemplates();
    this.templates = data;
    return data.map((t) => ({
      templateId: `${t.energyType}-template`,
      energyType: t.energyType ?? '',
    }));
  }

  // Devuelve un CLON del prototipo de la plantilla seleccionada.
  async cloneTemplate(type: string): Promise<OfferPrototype> {
    if (this.templates.length === 0) {
      await this.loadTemplates();
    }
    const source = this.templates.find((t) => t.energyType === type);
    if (!source) throw new Error(`No existe plantilla para el tipo: ${type}`);
    return OfferPrototype.from(source).copy();
  }
}

const prototypeRegistry = new PrototypeRegistry();
export default prototypeRegistry;
```

**Uso ligado al sistema en `OfferPrototypePanel` (React):**

```tsx
// Clonar la plantilla en el FRONTEND con el patron Prototype (TypeScript)
const handleCloneLocal = () => {
  const template = templates.find((t) => t.energyType === selectedType);
  if (!template) return;
  const clone = OfferPrototype.from(template).copy();   // → copia independiente
  const clonedOffer = clone.getOffer();
  setLocalClone(clonedOffer);                            // muestra id=undefined, kWh=total
  setProducerName(clonedOffer.producerName);
  setTotalKwh(String(clonedOffer.totalKwh));
  setPricePerKwh(String(clonedOffer.pricePerKwh));
};

// Publicar el clon: el BACKEND clona la plantilla con su PrototypeRegistry (PHP)
const handlePublish = async () => {
  const result = await api.createOfferFromTemplate({
    energyType: selectedType,
    producerName: producerName.trim(),
    totalKwh: qty,
    pricePerKwh: price >= 0 ? price : undefined,
  });
  alert(`Oferta #${result.id} creada como clon de la plantilla ${result.energyType}.`);
  onSystemChanged?.();   // refresca el dashboard
  handleCloneLocal();    // actualiza el clon local con el nuevo estado
};
```

**Uso ligado al sistema en `EnergyDashboard` (duplicar oferta existente):**

```tsx
const handleClone = async (offer: EnergyOffer) => {
  const answer = window.confirm(`Duplicar la oferta de ${offer.producerName}...`);
  if (!answer) return;
  const clone = await api.cloneOffer(offer.id!);   // POST /offers/{id}/clone
  alert(`Oferta #${clone.id} creada como clon de la #${offer.id}.`);
  fetchOffers();
};
```

## Video explicativo de los 3 metodos

> **Demostración del proyecto**
>
> En el siguiente video podrás conocer el funcionamiento del proyecto, observar sus principales características y ver una demostración de su implementación.

**[Ver video completo en YouTube](https://youtu.be/IJZKBrkxqkU)**



---

# Patrón Adapter

## ¿Qué es dentro del proyecto?

El **Adapter** se usa para integrar los **dispositivos IoT domésticos** (subsistema 3) cuyos formatos de datos **no coinciden** con los que espera el dominio. Cada fabricante habla su propio idioma: el medidor SCADA legado entrega **registros Modbus con unidades heredadas** (decivatios, centiamperios, hectovatios-hora) y un estado de enlace textual (`UP` / `DOWN`), mientras que el inversor fotovoltaico entrega un **payload JSON serializado como texto** con claves en mayúsculas, `P` en vatios, `E_TODAY` en vatios-hora y un código de estado numérico.

El patrón resuelve el problema de la forma canónica: se define una **interfaz objetivo (`DeviceGateway`)** que el dominio entiende, se dejan los dispositivos tal como son (**adaptee**) y se escriben **adaptadores** que traducen el idioma de cada fabricante al idioma común. El resultado siempre es el mismo modelo `DeviceTelemetry` (voltios, amperios, kW, kWh, °C).

El beneficio real se ve en el cliente: `DeviceMonitorService` (backend) y `DevicePanel` (frontend) trabajan **exclusivamente contra `DeviceGateway`**. Si mañana se integra un inversor de otra marca, solo se agrega su `Adapter` al registro: **ni el cliente ni el controlador cambian una sola línea**. Además, la opción preferible frente a modificar el legado es **no tocar el código del fabricante**.

**Implementaciones actuales (2):**

- `DeviceGateway` + `DeviceMonitorService` — Backend (PHP)
- `DeviceGateway` + `DevicePanel` — Frontend (TypeScript)

---

## 13. `DeviceGateway` / `DeviceMonitorService` — Backend

**Archivo:** `backend-laravel/app/Patterns/Adapters/DeviceGateway.php`, `backend-laravel/app/Patterns/Adapters/LegacyScadaMeter.php`, `backend-laravel/app/Patterns/Adapters/PvInverterDevice.php`, `backend-laravel/app/Patterns/Adapters/LegacyScadaAdapter.php`, `backend-laravel/app/Patterns/Adapters/PvInverterAdapter.php`, `backend-laravel/app/Patterns/Adapters/DeviceGatewayRegistry.php`, `backend-laravel/app/Patterns/Adapters/DeviceMonitorService.php` y `backend-laravel/app/Models/DeviceTelemetry.php`

**En qué consiste dentro del proyecto:** `DeviceGateway` es la **interfaz objetivo (Target)**: `getProviderKey()`, `getDeviceId()`, `getDisplayName()`, `isOnline()`, `getSupportedMetrics()` y `readTelemetry()`. Los dispositivos heredados quedan intactos como **adaptee**: `LegacyScadaMeter` expone `readRegister($direccion)` y `dumpRegisters()` con unidades propias, y `PvInverterDevice` expone `poll()` que devuelve el JSON **como texto**.

Cada **Adapter** cumple el contrato y hace la traducción: `LegacyScadaAdapter` convierte `'UP'`/`'DOWN'` a booleano, centiamperios a amperios, decivatios a kW, hectovatios-hora a kWh y decigrados a °C; `PvInverterAdapter` deserializa el JSON, renombra las claves en mayúsculas y convierte vatios a kW, vatios-hora a kWh y decigrados a °C, interpretando `STATUS = 0` como dispositivo sano.

`DeviceGatewayRegistry` es el punto de ensamblaje: es el **único** que conoce a la vez los adaptee y los adaptadores, y entrega gateways ya armados. `DeviceMonitorService` recibe `DeviceGateway[]` por constructor y expone `listDevices()`, `readTelemetry($deviceId)` y `getSummary()`; el consolidado por proveedor (`devicesByProvider`) demuestra que el cliente mezcla marcas sin distinguirlas. Los endpoints `GET /api/energy/devices`, `GET /api/energy/devices/{deviceId}/telemetry` y `GET /api/energy/devices/telemetry/summary` exponen el resultado ya normalizado.

**Diagrama UML:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ «interface»  DeviceGateway   (TARGET)                                    │
├──────────────────────────────────────────────────────────────────────────┤
│ + getProviderKey() : string                                              │
│ + getDeviceId() : string                                                 │
│ + getDisplayName() : string                                              │
│ + isOnline() : bool                                                      │
│ + getSupportedMetrics() : array                                          │
│ + readTelemetry() : DeviceTelemetry                                      │
└──────────────────────────────────────────────────────────────────────────┘

                  ▲                                     ▲
                  │ implementan                         │ implementan

┌────────────────────────────────────┐┌────────────────────────────────────┐
│ «Adapter» LegacyScadaAdapter       ││ «Adapter» PvInverterAdapter        │
├────────────────────────────────────┤├────────────────────────────────────┤
│ - meter : LegacyScadaMeter         ││ - device : PvInverterDevice        │
│ + readTelemetry() : DeviceTelemetry││ + readTelemetry() : DeviceTelemetry│
│ + isOnline() : boolean             ││ + isOnline() : boolean             │
│ + getSupportedMetrics() : array    ││ + getSupportedMetrics() : array    │
└────────────────────────────────────┘└────────────────────────────────────┘

                  │ envuelve                             │ envuelve

┌────────────────────────────────────┐┌────────────────────────────────────┐
│ «Adaptee» LegacyScadaMeter         ││ «Adaptee» PvInverterDevice         │
├────────────────────────────────────┤├────────────────────────────────────┤
│ + readRegister(int) : int          ││ + poll() : string                  │
│ + dumpRegisters() : array          ││ -                                  │
│ 30001 voltios                      ││ payload JSON en TEXTO              │
│ 30002 centiamperios                ││ P en vatios                        │
│ 30003 decivatios                   ││ E_TODAY en vatios-hora             │
│ 30004 hectovatios-hora             ││ TEMP en decigrados                 │
│ 30005 decigrados                   ││ STATUS: 0 = sano                   │
│ enlace: 'UP' / 'DOWN'              ││                                    │
└────────────────────────────────────┘└────────────────────────────────────┘

            └──── los dos Adapter entregan el mismo modelo normalizado ────┘

                  ┌────────────────────────────────────────────────────────┐
                  │ DeviceTelemetry   (modelo del dominio)                 │
                  ├────────────────────────────────────────────────────────┤
                  │ voltios · amperios · kW · kWh · °C                     │
                  │ + rawReading  (evidencia del origen crudo)             │
                  └────────────────────────────────────────────────────────┘

                                      ▲
                                      │ entrega

┌──────────────────────────────────────────────────────────────────────────┐
│ «Client»  DeviceMonitorService                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ + listDevices() : array                                                  │
│ + readTelemetry(string) : DeviceTelemetry                                │
│ + getSummary() : array                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ ctor: DeviceGateway[]     ← solo conoce la interfaz                      │
│ no sabe si el dato vino de un medidor SCADA o de un inversor             │
└──────────────────────────────────────────────────────────────────────────┘

                                      ▲  recibe los gateways ya armados

                  ┌────────────────────────────────────────────────────────┐
                  │ DeviceGatewayRegistry  (punto de ensamblaje)           │
                  ├────────────────────────────────────────────────────────┤
                  │ + register(DeviceGateway) : void                       │
                  │ + all() : DeviceGateway[]                              │
                  │ único módulo que conoce Adaptee + Adapter              │
                  └────────────────────────────────────────────────────────┘

                                      ▼

                  ┌────────────────────────────────────────────────────────┐
                  │ EnergyController  (API)                                │
                  ├────────────────────────────────────────────────────────┤
                  │ GET  /api/energy/devices                               │
                  │ GET  /api/energy/devices/{deviceId}/telemetry          │
                  │ GET  /api/energy/devices/telemetry/summary             │
                  └────────────────────────────────────────────────────────┘
```
**Código clave** — la interfaz objetivo (`DeviceGateway.php`):

```php
interface DeviceGateway
{
    public function getProviderKey(): string;
    public function getDeviceId(): string;
    public function getDisplayName(): string;
    public function isOnline(): bool;
    public function getSupportedMetrics(): array;
    public function readTelemetry(): DeviceTelemetry;
}
```

**Código clave** — el adaptee que **no** se modifica (`LegacyScadaMeter.php`):

```php
class LegacyScadaMeter
{
    public const REG_VOLTAGE = 30001;    // voltios
    public const REG_CURRENT = 30002;    // centiamperios
    public const REG_POWER = 30003;     // decivatios (0.1 W)
    public const REG_ENERGY = 30004;     // hectovatios-hora (0.01 kWh)
    public const REG_TEMPERATURE = 30005; // decigrados Celsius

    public function readRegister(int $address): int
    {
        return $this->registers[$address] ?? 0;
    }

    public function getLinkState(): string   // 'UP' o 'DOWN'
    {
        return $this->linkState;
    }
}
```

**Código clave** — el adaptador que traduce (`LegacyScadaAdapter.php`):

```php
class LegacyScadaAdapter implements DeviceGateway
{
    public function __construct(private LegacyScadaMeter $meter) {}

    public function isOnline(): bool
    {
        // 'UP' / 'DOWN'  ->  booleano del dominio
        return $this->meter->getLinkState() === 'UP';
    }

    public function readTelemetry(): DeviceTelemetry
    {
        $telemetry = new DeviceTelemetry();
        $telemetry->deviceId = $this->getDeviceId();
        $telemetry->deviceType = 'smart-meter';
        $telemetry->online = $this->isOnline();

        // Traduccion de unidades heredadas a unidades del dominio
        $telemetry->current = $this->meter->readRegister(LegacyScadaMeter::REG_CURRENT) / 100;      // -> A
        $telemetry->powerKw = ($this->meter->readRegister(LegacyScadaMeter::REG_POWER) / 10) / 1000; // -> kW
        $telemetry->energyKwh = $this->meter->readRegister(LegacyScadaMeter::REG_ENERGY) / 100;       // -> kWh
        $telemetry->temperatureC = $this->meter->readRegister(LegacyScadaMeter::REG_TEMPERATURE) / 10; // -> C

        $telemetry->rawReading = 'registros SCADA 30001-30005 (...) - enlace ' . $this->meter->getLinkState();

        return $telemetry;
    }
}
```

**Código clave** — el segundo adaptador, con otro idioma (`PvInverterAdapter.php`):

```php
class PvInverterAdapter implements DeviceGateway
{
    public function __construct(private PvInverterDevice $device) {}

    public function readTelemetry(): DeviceTelemetry
    {
        $payload = json_decode($this->device->poll(), true); // texto -> array

        $telemetry = new DeviceTelemetry();
        $telemetry->online = (int) ($payload['STATUS'] ?? 1) === 0;   // 0 = sano
        $telemetry->powerKw = (float) ($payload['P'] ?? 0) / 1000;     // W -> kW
        $telemetry->energyKwh = (float) ($payload['E_TODAY'] ?? 0) / 1000; // Wh -> kWh
        $telemetry->temperatureC = (float) ($payload['TEMP'] ?? 0) / 10;   // decigrados -> C

        return $telemetry;
    }
}
```

**Código clave** — el ensamblaje y el cliente (`DeviceGatewayRegistry.php` y `DeviceMonitorService.php`):

```php
class DeviceGatewayRegistry
{
    public function __construct()
    {
        foreach (LegacyScadaMeter::createSampleFleet() as $meter) {
            $this->register(new LegacyScadaAdapter($meter));   // un Adapter por dispositivo
        }
        foreach (PvInverterDevice::createSampleFleet() as $device) {
            $this->register(new PvInverterAdapter($device));
        }
    }
}

class DeviceMonitorService
{
    // El cliente recibe interfaces, jamas clases concretas:
    public function __construct(private array $gateways) {}   // DeviceGateway[]

    public function getSummary(): array
    {
        foreach ($this->gateways as $gateway) {
            $telemetry = $gateway->readTelemetry();  // no sabe si es SCADA o inversor
            // ...
        }
    }
}
```

**Endpoints del patrón Adapter:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/energy/devices` | Inventario IoT normalizado (el cliente solo ve `DeviceGateway`) |
| GET | `/api/energy/devices/{deviceId}/telemetry` | Telemetría de un dispositivo ya traducida a `DeviceTelemetry` |
| GET | `/api/energy/devices/telemetry/summary` | Consolidado de la red: dispositivos en línea, kW totales y reparto por fabricante |
| GET | `/api/energy/legacy/meters` | Datos **crudos** del adaptee SCADA (registros 30001-30005) |
| GET | `/api/energy/legacy/inverters` | Datos **crudos** del adaptee inversor (payload JSON en texto) |

Los dos últimos endpoints exponen el "antes" de la adaptación: son los que consumen los adaptadores del frontend para demostrar que ambos lados producen el mismo modelo normalizado.

---

## 14. `DeviceGateway` / `DevicePanel` — Frontend

**Archivo:** `frontend/src/patterns/adapter/DeviceGateway.ts`, `frontend/src/patterns/adapter/LegacyScadaClient.ts`, `frontend/src/patterns/adapter/PvInverterClient.ts`, `frontend/src/patterns/adapter/ScadaGatewayAdapter.ts`, `frontend/src/patterns/adapter/InverterGatewayAdapter.ts`, `frontend/src/patterns/adapter/deviceGatewayRegistry.ts` y `frontend/src/components/DevicePanel.tsx`

**En qué consiste dentro del proyecto:** La estructura es la misma que en el backend, pero en el **navegador**. `DeviceGateway.ts` declara la interfaz objetivo (`getProviderKey`, `getDeviceId`, `getDisplayName`, `isOnline`, `getSupportedMetrics`, `readTelemetry`) junto con el tipo `DeviceTelemetry` que devuelve. Los **adaptee** son los clientes HTTP de cada sistema legado: `LegacyScadaClient` pide `/energy/legacy/meters` y recibe registros crudos, y `PvInverterClient` pide `/energy/legacy/inverters` y recibe el JSON como texto. Ninguno de los dos pasa por `EnergyApiService`, precisamente porque su respuesta **no** tiene el formato que la aplicación espera.

`ScadaGatewayAdapter` e `InverterGatewayAdapter` cumplen el contrato traduciendo unidades y estados, y `deviceGatewayRegistry` decide qué adaptador corresponde a cada dispositivo: es el único módulo que conoce los sistemas legados. `DevicePanel` es el **cliente**: pide los gateways al registro, llama `readTelemetry()` y renderiza las métricas sin saber quién fabricó el dato. El panel permite alternar entre el **adaptador del navegador** (estos) y el **adaptador del backend** (los de PHP) para comprobar que ambos entregan la misma telemetría normalizada.

**Diagrama UML:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ DeviceGateway   (TARGET, interface TypeScript)                           │
├──────────────────────────────────────────────────────────────────────────┤
│ + getProviderKey() : string                                              │
│ + getDeviceId() : string                                                 │
│ + getDisplayName() : string                                              │
│ + isOnline() : Promise<boolean>                                          │
│ + getSupportedMetrics() : Record<string, string>                         │
│ + readTelemetry() : Promise<DeviceTelemetry>                             │
└──────────────────────────────────────────────────────────────────────────┘

                  ▲                                     ▲
                  │ implementan                         │ implementan

┌────────────────────────────────────┐┌────────────────────────────────────┐
│ «Adapter» ScadaGatewayAdapter      ││ «Adapter» InverterGatewayAdapter   │
├────────────────────────────────────┤├────────────────────────────────────┤
│ - client : LegacyScadaClient       ││ - client : PvInverterClient        │
│ - serial : string                  ││ - serial : string                  │
│ + readTelemetry() : Promise        ││ + readTelemetry() : Promise        │
└────────────────────────────────────┘└────────────────────────────────────┘

                  │ envuelve                             │ envuelve

┌────────────────────────────────────┐┌────────────────────────────────────┐
│ «Adaptee» LegacyScadaClient        ││ «Adaptee» PvInverterClient         │
├────────────────────────────────────┤├────────────────────────────────────┤
│ + fetchRegisterDumps() : Promise   ││ + fetchPollPayloads() : Promise    │
│ -                                  ││ -                                  │
│ GET /energy/legacy/meters          ││ GET /energy/legacy/inverters       │
│ registros 30001..30005 crudos      ││ payload JSON como texto            │
│ enlace: 'UP' / 'DOWN'              ││ P en W · TEMP en decigrados        │
└────────────────────────────────────┘└────────────────────────────────────┘

            └──── se traducen a voltios · amperios · kW · kWh · °C ────┘

              ┌────────────────────────────────────────────────────────────┐
              │ DeviceGatewayRegistry   (punto de ensamblaje)              │
              ├────────────────────────────────────────────────────────────┤
              │ + gateways() : Promise<DeviceGateway[]>                    │
              │ + build() : Promise<DeviceGateway[]>                       │
              │ un Adapter por cada dispositivo descubierto                │
              └────────────────────────────────────────────────────────────┘

                                      ▼  devuelve DeviceGateway[]

              ┌────────────────────────────────────────────────────────────┐
              │ «Client»  DevicePanel   (React)                            │
              ├────────────────────────────────────────────────────────────┤
              │ + gateway.readTelemetry() : Promise<DeviceTelemetry>       │
              │ -                                                          │
              │ renderiza las métricas normalizadas                        │
              │ y el origen crudo (rawReading) de cada una                 │
              └────────────────────────────────────────────────────────────┘

                                      ▲
                                      │

                                      ▼

              ┌────────────────────────────────────────────────────────────┐
              │ Alternativa seleccionable en el panel                      │
              ├────────────────────────────────────────────────────────────┤
              │ GET /api/energy/devices                                    │
              │ GET /api/energy/devices/{deviceId}/telemetry               │
              │ (Adapter del backend en PHP: mismo resultado)              │
              └────────────────────────────────────────────────────────────┘
```
**Código clave** — la interfaz objetivo (`DeviceGateway.ts`):

```typescript
export interface DeviceGateway {
  getProviderKey(): string;
  getDeviceId(): string;
  getDisplayName(): string;
  isOnline(): Promise<boolean>;
  getSupportedMetrics(): Record<string, string>;
  readTelemetry(): Promise<DeviceTelemetry>;
}
```

**Código clave** — el adaptador que traduce registros SCADA (`ScadaGatewayAdapter.ts`):

```typescript
const REG = { voltage: 30001, current: 30002, power: 30003, energy: 30004, temperature: 30005 } as const;

export class ScadaGatewayAdapter implements DeviceGateway {
  constructor(private client: LegacyScadaClient, private serial: string) {}

  getProviderKey(): string { return 'legacy-scada'; }
  getDeviceId(): string { return `scada-${this.serial.toLowerCase()}`; }

  async readTelemetry(): Promise<DeviceTelemetry> {
    const dump = await this.dump();
    const read = (address: number): number => Number(dump.registers[String(address)] ?? 0);

    // centiamperios -> A · decivatios -> kW · hectovatios-hora -> kWh · decigrados -> C
    const current = read(REG.current) / 100;
    const powerKw = read(REG.power) / 10 / 1000;
    const energyKwh = read(REG.energy) / 100;
    const temperatureC = read(REG.temperature) / 10;

    return {
      deviceId: this.getDeviceId(),
      provider: this.getProviderKey(),
      online: dump.linkState === 'UP',        // 'UP' / 'DOWN' -> booleano
      voltage: read(REG.voltage),
      current, powerKw, energyKwh, temperatureC,
      rawReading: `registros SCADA ${REG.voltage}-${REG.temperature} (...) - enlace ${dump.linkState}`,
      metrics: { /* label, value, unit ya normalizados */ },
    };
  }
}
```

**Código clave** — el registro que decide qué adaptador usar (`deviceGatewayRegistry.ts`):

```typescript
class DeviceGatewayRegistry {
  private cache: DeviceGateway[] | null = null;

  private async build(): Promise<DeviceGateway[]> {
    const scada = new LegacyScadaClient();
    const inverter = new PvInverterClient();

    const [meters, inverters] = await Promise.all([
      scada.fetchRegisterDumps(),
      inverter.fetchPollPayloads(),
    ]);

    return [
      ...meters.map((m) => new ScadaGatewayAdapter(scada, m.serial)),
      ...inverters.map((d) => new InverterGatewayAdapter(inverter, d.serial)),
    ];
  }
}

const registry = new DeviceGatewayRegistry();
export default registry;
```

**Uso ligado al sistema en `DevicePanel` (React):**

```tsx
// El componente es el CLIENTE: solo conoce la interfaz DeviceGateway.
const gateways: DeviceGateway[] = await deviceGatewayRegistry.gateways();
const telemetry = await Promise.all(gateways.map((gateway) => gateway.readTelemetry()));

// Cada fila muestra el valor normalizado y, debajo, de donde vino:
//   scada-itm-4417  | 0.171 kW | 1284.5 kWh
//   origen crudo: registros SCADA 30001-30005 (...) - enlace UP
//   inverter-inv-77021 | 1.85 kW | 4.21 kWh
//   origen crudo: payload JSON del polling (GRID_CONNECTED) ... STATUS 0

// El selector "Origen de la telemetria" alterna entre estos adaptadores
// (navegador) y los del backend (/api/energy/devices/...), verificando
// que ambos lados entregan el mismo modelo normalizado.
```

---

# Patrón Bridge

## ¿Qué es dentro del proyecto?

El **Bridge** se usa en las **liquidaciones de energía** para separar dos dimensiones que hoy están mezcladas: **qué reglas de negocio aplican** (perfil del cliente) y **en qué moneda se cobra**. Sin el patrón, cada combinación de perfil y moneda exigiría una clase nueva (`FacturaResidencialCOP`, `FacturaResidencialUSD`, `FacturaComercialCOP`…), es decir, el **producto cartesiano** de ambas dimensiones.

La solución es separar las dos jerarquías: la **abstracción** (`EnergyBill` y sus refinamientos `ResidentialBill` / `CommercialBill`) define el flujo de liquidación y **contiene** una referencia al **implementor** (`CurrencyBridge`); el implementor y sus implementaciones concretas (`CopCurrency`, `UsdCurrency`, `EurCurrency`) definen únicamente la moneda: formato, decimales, impuesto y conversión. Ninguna de las dos jerarquías conoce a la otra: no hay herencia entre `EnergyBill` y `CurrencyBridge`.

El resultado es que **ambos ejes varían de forma independiente**: se pueden agregar perfiles (industrial, comunitario) o monedas (GBP, JPY) sin tocar la jerarquía contraria. `SettlementService` es el **cliente**: se limita a componer una abstracción refinada con un implementor concreto y a exponer la matriz de combinaciones (`GET /api/energy/settlements/matrix`), que hoy es de **2 perfiles × 3 monedas = 6** liquidatedores, repartidos en 8 clases.

**Implementaciones actuales (2):**

- `EnergyBill` + `CurrencyBridge` — Backend (PHP)
- `EnergyBill` + `CurrencyBridge` — Frontend (TypeScript)

---

## 15. `EnergyBill` / `CurrencyBridge` — Backend

**Archivo:** `backend-laravel/app/Patterns/Bridges/EnergyBill.php`, `backend-laravel/app/Patterns/Bridges/ResidentialBill.php`, `backend-laravel/app/Patterns/Bridges/CommercialBill.php`, `backend-laravel/app/Patterns/Bridges/CurrencyBridge.php`, `backend-laravel/app/Patterns/Bridges/CopCurrency.php`, `backend-laravel/app/Patterns/Bridges/UsdCurrency.php`, `backend-laravel/app/Patterns/Bridges/EurCurrency.php` y `backend-laravel/app/Patterns/Bridges/SettlementService.php`

**En qué consiste dentro del proyecto:** `CurrencyBridge` es el **implementor**: declara `getCode()`, `getSymbol()`, `getLabel()`, `getDecimals()`, `getTaxRate()`, `getUsdRate()`, `convertFromUsd()`, `convertToMinorUnits()` y `format()`. No sabe nada de facturas. Sus tres implementaciones concretas aplican el formato local (COP sin decimales con punto de miles, USD con coma de miles, EUR con el símbolo al final) y su impuesto (19 %, 10 % y 21 %).

`EnergyBill` es la **abstracción**: recibe un `CurrencyBridge` por constructor y define el flujo común de liquidación en `build()` — subtotal, ajustes del perfil, base imponible, impuesto y total — apoyándose **solo en la interfaz** del implementor (`format()`, `convertToMinorUnits()`, `getTaxRate()`). Los refinamientos aportan las reglas de su perfil: `ResidentialBill` aplica el subsidio del 5 % y `CommercialBill` el recargo del 2 % más una tarifa fija de **US$ 25 convertida con el implementor** (`convertFromUsd`), que por eso vale $ 97.500 COP, US$ 25 o 23 € según la moneda.

`SettlementService` (cliente) compone ambas jerarquías: resuelve la moneda, instancia la refinación de la abstracción y devuelve la liquidación. Además expone `getMatrix()` con perfiles, monedas y combinaciones, y `getProfiles()` / `getCurrencies()` para poblar la interfaz. Los endpoints `GET /api/energy/settlements/matrix` y `POST /api/energy/settlements/quote` exponen el patrón.

**Diagrama UML:**

```
┌────────────────────────────────┐      ┌────────────────────────────────────┐
│ ABSTRACCION                    │      │ IMPLEMENTOR                        │
├────────────────────────────────┤      ├────────────────────────────────────┤
│ «abstract» EnergyBill          │      │ «interface» CurrencyBridge         │
│ - currency : CurrencyBridge    │◄─────┤ + getCode() : string             │
│ + build(array) : array         │      │ + getSymbol() : string             │
│ + getProfileKey() : string     │─────►│ + getDecimals() : int            │
│ + applyProfileRules() : array  │      │ + getTaxRate() : float             │
└────────────────────────────────┘      │ + getUsdRate() : float             │
                                        │ + convertFromUsd(f) : float        │
                                        │ + convertToMinorUnits(f) : int     │
                                        │ + format(f) : string               │
                                        └────────────────────────────────────┘

                                   (contiene un CurrencyBridge; usa solo su interfaz, nunca la clase)

               ▲                               ▼
  hereda                      hereda                         ▼            ▼            ▼

┌──────────────────────────────┐┌──────────────────────────────┐  ┌──────────────────────┐┌──────────────────────┐
│ ResidentialBill              ││ CommercialBill               │  │ CopCurrency          ││ UsdCurrency          │
├──────────────────────────────┤├──────────────────────────────┤  │ IVA 19%              ││ IVA 10%              │
│ subsidia el 5% del subtotal  ││ +2% y tarifa fija US$ 25     │  │ 0 decimales          ││ 2 decimales          │
└──────────────────────────────┘└──────────────────────────────┘  └──────────────────────┘└──────────────────────┘

      EnergyBill  -X->  CurrencyBridge      (la abstracción usa la interfaz, no la clase)
      CurrencyBridge  -X->  EnergyBill      (el implementor no sabe qué factura se cobra)

                                                        ┌────────────────────────────────────────────────────────┐
                                                        │ «Client»  SettlementService                            │
                                                        ├────────────────────────────────────────────────────────┤
                                                        │ + quote(profile, currency, array) : array              │
                                                        │ + getMatrix() : array                                  │
                                                        │ + getProfiles() : array                                │
                                                        │ + getCurrencies() : array                              │
                                                        ├────────────────────────────────────────────────────────┤
                                                        │ new ResidentialBill(new CopCurrency())                 │
                                                        │ ← composición: sin herencia entre las dos jerarquías   │
                                                        └────────────────────────────────────────────────────────┘

                                                         │

                                                         ▼

                                                  ┌──────────────────────────────────────────────────────────────┐
                                                  │ 2 perfiles × 3 monedas = 6 combinaciones                     │
                                                  ├──────────────────────────────────────────────────────────────┤
                                                  │ residential + COP / USD / EUR     (subsidio 5%)              │
                                                  │ commercial  + COP / USD / EUR     (recargo 2% + US$ 25)      │
                                                  ├──────────────────────────────────────────────────────────────┤
                                                  │ Agregar un perfil NO obliga a tocar la moneda                │
                                                  │ Agregar una moneda NO obliga a tocar el perfil               │
                                                  └──────────────────────────────────────────────────────────────┘

                                GET  /api/energy/settlements/matrix
                                POST /api/energy/settlements/quote
```
**Código clave** — el implementor (`CurrencyBridge.php`):

```php
interface CurrencyBridge
{
    public function getCode(): string;
    public function getSymbol(): string;
    public function getDecimals(): int;
    public function getTaxRate(): float;
    public function getUsdRate(): float;
    public function convertFromUsd(float $usdAmount): float;
    public function convertToMinorUnits(float $amount): int;
    public function format(float $amount): string;
}
```

**Código clave** — un implementor concreto (`CopCurrency.php`):

```php
class CopCurrency implements CurrencyBridge
{
    private const USD_RATE = 3900.0;  // 1 USD = 3.900 COP
    private const TAX_RATE = 0.19;    // IVA Colombia

    public function getDecimals(): int { return 0; }
    public function getTaxRate(): float { return self::TAX_RATE; }

    public function convertFromUsd(float $usdAmount): float
    {
        return $usdAmount * self::USD_RATE;
    }

    public function format(float $amount): string
    {
        return '$ ' . number_format($amount, 0, ',', '.') . ' COP';
    }
}
```

**Código clave** — la abstracción: el flujo común, sin conocer ninguna moneda (`EnergyBill.php`):

```php
abstract class EnergyBill
{
    public function __construct(protected CurrencyBridge $currency) {}

    abstract protected function applyProfileRules(float $subtotal, array $data): array;

    public function build(array $data): array
    {
        $subtotal = $data['kwh'] * $data['pricePerKwh'];
        $adjustments = $this->applyProfileRules($subtotal, $data);  // regla del perfil
        $base = $subtotal + array_sum(array_column($adjustments, 'amount'));

        // Todo lo monetario viene del IMPLEMENTOR, no de una clase concreta:
        $tax = $base * $this->currency->getTaxRate();
        $total = $base + $tax;

        return [
            'profile' => $this->getProfileKey(),
            'currency' => $this->currency->getCode(),
            'adjustments' => $adjustments,
            'total' => round($total, 2),
            'totalFormatted' => $this->currency->format($total),
            'totalMinorUnits' => $this->currency->convertToMinorUnits($total),
        ];
    }
}
```

**Código clave** — refinamientos que usan el implementor en sus propias reglas:

```php
class ResidentialBill extends EnergyBill
{
    private const SUBSIDY_RATE = 0.05;

    protected function applyProfileRules(float $subtotal, array $data): array
    {
        // Porcentaje: independiente de la moneda
        return [['label' => 'Subsidio residencial (5%)', 'amount' => -round($subtotal * self::SUBSIDY_RATE, 2)]];
    }
}

class CommercialBill extends EnergyBill
{
    private const SURCHARGE_RATE = 0.02;
    private const FLAT_FEE_USD = 25.0;

    protected function applyProfileRules(float $subtotal, array $data): array
    {
        return [
            ['label' => 'Recargo comercial (2%)', 'amount' => round($subtotal * self::SURCHARGE_RATE, 2)],
            // La tarifa fija se convierte con el IMPLEMENTOR:
            ['label' => 'Tarifa de servicio comercial (US$ 25)',
             'amount' => round($this->currency->convertFromUsd(self::FLAT_FEE_USD), 2)],
        ];
    }
}
```

**Código clave** — el cliente que compone ambas jerarquías (`SettlementService.php`):

```php
/** @var array<string, class-string<EnergyBill>> */
private array $profiles;   // ['residential' => ResidentialBill::class, 'commercial' => CommercialBill::class]

public function quote(string $profile, string $currencyCode, array $data): array
{
    $bill = $this->createBill($profile, $this->resolveCurrency($currencyCode));
    return $bill->build($data);
}

private function createBill(string $profile, CurrencyBridge $currency): EnergyBill
{
    // Instanciacion tipica del cliente en Bridge: refinacion + implementor,
    // sin herencia entre ambas jerarquias.
    $class = $this->profiles[$profile] ?? null;

    if ($class === null) {
        throw new \InvalidArgumentException('Perfil de liquidacion desconocido: ' . $profile);
    }

    return new $class($currency);
}
```

**Prueba de la variación independiente** (`2 × 3` combinaciones sin condicionales anidados):

| Perfil \ Moneda | COP (19 %) | USD (10 %) | EUR (21 %) |
|-----------------|-----------|------------|------------|
| `residential` (subsidio 5 %) | `$ 28.263 COP` | `US$ 522.50 USD` | `574,75 €` |
| `commercial` (recargo 2 % + US$ 25) | `$ 146.370 COP` | `US$ 588.50 USD` | `644,93 €` |

*Valores para 50 kWh a 500 COP/kWh (residencial) y 50 kWh a 10 USD/kWh (comercial). La tarifa fija de US$ 25 se convierte sola: 97.500 COP, 25 USD y 23 €.*

**Endpoints del patrón Bridge:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/energy/settlements/matrix` | Perfiles, monedas y combinaciones soportadas (producto cartesiano) |
| POST | `/api/energy/settlements/quote` | Emite la liquidación: une `EnergyBill` + `CurrencyBridge` y devuelve el total formateado |

---

## 16. `EnergyBill` / `CurrencyBridge` — Frontend

**Archivo:** `frontend/src/patterns/bridge/EnergyBill.ts`, `frontend/src/patterns/bridge/ResidentialBill.ts`, `frontend/src/patterns/bridge/CommercialBill.ts`, `frontend/src/patterns/bridge/CurrencyBridge.ts`, `frontend/src/patterns/bridge/CopCurrency.ts`, `frontend/src/patterns/bridge/UsdCurrency.ts`, `frontend/src/patterns/bridge/EurCurrency.ts`, `frontend/src/patterns/bridge/SettlementService.ts` y `frontend/src/components/SettlementPanel.tsx`

**En qué consiste dentro del proyecto:** La misma estructura del Bridge en TypeScript. `CurrencyBridge.ts` declara el implementor (`code`, `symbol`, `label`, `decimals`, `taxRate`, `usdRate`, `convertFromUsd`, `convertToMinorUnits`, `format`); `CopCurrency`, `UsdCurrency` y `EurCurrency` lo implementan con `Intl.NumberFormat` para el formato local. `EnergyBill.ts` es la abstracción: recibe el implementor en el constructor y define el flujo `build()` reutilizando la interfaz; `ResidentialBill` y `CommercialBill` aportan las reglas de su perfil.

`SettlementService.ts` es el cliente: compone ambas jerarquías y permite calcular **localmente** cualquier combinación sin llamar al servidor. `SettlementPanel` mueve los dos ejes con dos selectores independientes (perfil y moneda), muestra la liquidación calculada en el navegador y, al pulsar **Emitir liquidación en el backend**, solicita la misma operación al Bridge de PHP: si los totales coinciden, el panel confirma que ambas implementaciones del patrón producen el mismo resultado.

**Diagrama UML:**

```
┌────────────────────────────────┐      ┌────────────────────────────────────┐
│ ABSTRACCION                    │      │ IMPLEMENTOR                        │
├────────────────────────────────┤      ├────────────────────────────────────┤
│ «abstract» EnergyBill          │      │ «interface» CurrencyBridge         │
│ - currency : CurrencyBridge    │◄─────┤ + code / symbol / label          │
│ + build(input) : BillResult    │      │ + decimals / taxRate / usdRate     │
│ + getProfileKey() : string     │─────►│ + decimals / taxRate / usdRate    │
│ + applyProfileRules() : Rule[] │      │ + convertToMinorUnits(f) : number  │
└────────────────────────────────┘      │ + format(f) : string               │
                                        └────────────────────────────────────┘

                                   (contiene un CurrencyBridge; usa solo su interfaz, nunca la clase)

               ▲                               ▼
  hereda                      hereda                         ▼            ▼            ▼

┌──────────────────────────────┐┌──────────────────────────────┐  ┌──────────────────────┐┌──────────────────────┐
│ ResidentialBill              ││ CommercialBill               │  │ CopCurrency          ││ UsdCurrency          │
├──────────────────────────────┤├──────────────────────────────┤  │ IVA 19%              ││ IVA 10%              │
│ subsidia el 5% del subtotal  ││ +2% y tarifa fija US$ 25     │  └──────────────────────┘└──────────────────────┘
└──────────────────────────────┘└──────────────────────────────┘

      EnergyBill  -X->  CurrencyBridge      (la abstracción usa la interfaz, no la clase)
      CurrencyBridge  -X->  EnergyBill      (el implementor no sabe qué factura se cobra)

                                              ┌──────────────────────────────────────────────────────────────────┐
                                              │ «Client»  SettlementService   (TypeScript)                       │
                                              ├──────────────────────────────────────────────────────────────────┤
                                              │ + quote(profile, currency, input) : BillResult                   │
                                              │ + getProfiles() : ProfileInfo[]   → los 2 selectores             │
                                              │ + getCurrencies() : CurrencyInfo[]                               │
                                              ├──────────────────────────────────────────────────────────────────┤
                                              │ new CommercialBill(new UsdCurrency())                            │
                                              │ ← permite calcular CUALQUIER combinación sin backend             │
                                              └──────────────────────────────────────────────────────────────────┘

                                                        │

                                                        ▼

                                              ┌──────────────────────────────────────────────────────────────────┐
                                              │ SettlementPanel   (React)                                        │
                                              ├──────────────────────────────────────────────────────────────────┤
                                              │ [ selector PERFIL  ·  selector MONEDA ]                          │
                                              │ liquidacion calculada en el navegador con el Bridge              │
                                              │ -                                                                │
                                              │ POST /api/energy/settlements/quote                               │
                                              │ el Bridge de PHP devuelve el MISMO total                         │
                                              └──────────────────────────────────────────────────────────────────┘
```
**Código clave** — la abstracción con el flujo común (`EnergyBill.ts`):

```typescript
export abstract class EnergyBill {
  constructor(protected currency: CurrencyBridge) {}

  abstract getProfileKey(): string;
  abstract applyProfileRules(subtotal: number): BillAdjustment[];

  build(input: BillInput): EnergyBillResult {
    const subtotal = input.kwh * input.pricePerKwh;
    const adjustments = this.applyProfileRules(subtotal);
    const base = subtotal + adjustments.reduce((acc, a) => acc + a.amount, 0);

    // Todo lo monetario viene del IMPLEMENTOR:
    const tax = base * this.currency.taxRate;
    const total = base + tax;

    return {
      currency: this.currency.code,
      total: round(total, 2),
      totalFormatted: this.currency.format(total),
      totalMinorUnits: this.currency.convertToMinorUnits(total),
      // ...
    };
  }
}
```

**Código clave** — refinamiento que convierte con el implementor (`CommercialBill.ts`):

```typescript
const SURCHARGE_RATE = 0.02;
const FLAT_FEE_USD = 25.0;

export class CommercialBill extends EnergyBill {
  applyProfileRules(subtotal: number): BillAdjustment[] {
    const flatFee = round(this.currency.convertFromUsd(FLAT_FEE_USD), 2);  // 97.500 COP | 25 USD | 23 EUR
    return [
      { label: `Recargo comercial (${SURCHARGE_RATE * 100}%)`, amount: round(subtotal * SURCHARGE_RATE, 2), amountFormatted: this.currency.format(subtotal * SURCHARGE_RATE) },
      { label: `Tarifa de servicio comercial (US$ ${FLAT_FEE_USD})`, amount: flatFee, amountFormatted: this.currency.format(flatFee) },
    ];
  }
}
```

**Uso ligado al sistema en `SettlementPanel` (React):**

```tsx
// Los dos ejes del Bridge se mueven por separado: cambiar la moneda no
// cambia las reglas del perfil, y viceversa.
<select value={profile} onChange={(e) => setProfile(e.target.value)}>   // abstraccion
  {profiles.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
</select>
<select value={currency} onChange={(e) => setCurrency(e.target.value)}> // implementor
  {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.label} (IVA {...})</option>)}
</select>

// Bridge en el FRONTEND (TypeScript)
const localBill = settlementService.quote(profile, currency, { kwh, pricePerKwh });

// Bridge en el BACKEND (PHP): se valida que ambas capas coinciden
const backendBill = await api.quoteSettlement({ profile, currency, kwh, pricePerKwh });
const sameTotal = Math.abs(localBill.total - backendBill.total) < 0.01;
```

---

# Patrón Decorator

## ¿Qué es dentro del proyecto?

El **Decorator** se usa para agregarle **extras a una oferta de energía** sin modificar la oferta original: certificación verde, seguro de suministro y entrega prioritaria. En lugar de crear una clase por cada combinación de extras, una **oferta base** (`BasicOffer`) se **envuelve** con uno o varios decoradores, cada uno con su recargo, su etiqueta y su descripción, acumulados de forma anidada.

Se aplica al subsistema de **compra y venta de excedentes**: la oferta publicada es el componente concreto y los extras son funcionalidades añadidas dinámicamente, en cualquier orden y cantidad.

**Implementaciones actuales (2):**

- `BasicOffer` + decoradores + `OfferPricingService` — Backend (PHP)
- `BasicOffer` + decoradores + `OfferPricingService` — Frontend (TypeScript)

---

## 17. `BasicOffer` / `OfferDecorator` / `OfferPricingService` — Backend

**Archivos:** `backend-laravel/app/Patterns/Decorators/OfferComponent.php`, `BasicOffer.php`, `OfferDecorator.php`, `GreenCertificationDecorator.php`, `InsuranceDecorator.php`, `PriorityDeliveryDecorator.php` y `OfferPricingService.php`

**En qué consiste dentro del proyecto:** `OfferComponent` es la interfaz común (`getDescription()`, `getBasePrice()`, `getExtrasTotal()`, `getTotal()`, `getAdjustments()`). `BasicOffer` es el componente concreto: subtotal = kWh × precio. `OfferDecorator` es el decorador base que delega todo en el componente envuelto, y cada decorador concreto añade un ajuste:

- `GreenCertificationDecorator` — +5% sobre el subtotal base.
- `InsuranceDecorator` — +3% sobre el subtotal base.
- `PriorityDeliveryDecorator` — +$8.000 COP tarifa fija.

`OfferPricingService` es el cliente: envuelve el `BasicOffer` con los decoradores solicitados. Endpoints: `GET /api/energy/extras` (catálogo de extras) y `POST /api/energy/offers/quote-extras` (cotización decorada).

**Diagrama UML:**

```
┌──────────────────────────────────┐
│         «interface»              │
│        OfferComponent            │
├──────────────────────────────────┤
│ + getDescription() : string      │
│ + getBasePrice() : float         │
│ + getExtrasTotal() : float       │
│ + getTotal() : float             │
│ + getAdjustments() : array       │
└───────────────▲──────────────────┘
                │ implementa
      ┌─────────┴─────────┐
      ▼                   ▼
┌──────────────┐  ┌────────────────────────┐
│  BasicOffer  │  │   «abstract»           │
│ (componente  │  │   OfferDecorator       │
│  concreto)   │  │ - wrapped : OfferComponent │
└──────────────┘  └───────────▲────────────┘
                              │ extienden
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────┐ ┌─────────────────────────┐
│ GreenCertification│ │  Insurance    │ │  PriorityDelivery       │
│ Decorator  (+5%)  │ │  Decorator(+3%)│ │  Decorator  (+$8.000)  │
└───────────────────┘ └───────────────┘ └─────────────────────────┘
```

**Código clave:**

```php
$offer = new BasicOffer(20, 500);                // componente concreto
$offer = new GreenCertificationDecorator($offer); // lo envuelve: +5%
$offer = new PriorityDeliveryDecorator($offer);    // lo vuelve a envolver: +$8.000

echo $offer->getTotal(); // 10000 + 500 + 8000 = 18500
```

---

## 18. `BasicOffer` / `OfferDecorator` / `OfferPricingService` — Frontend

**Archivos:** `frontend/src/patterns/decorator/OfferComponent.ts`, `BasicOffer.ts`, `OfferDecorator.ts`, `GreenCertificationDecorator.ts`, `InsuranceDecorator.ts`, `PriorityDeliveryDecorator.ts`, `OfferPricingService.ts` y `frontend/src/components/OfferExtrasPanel.tsx`

**En qué consiste dentro del proyecto:** La misma estructura del Decorator en TypeScript. `OfferExtrasPanel` muestra el cálculo **local** (navegador) y ofrece el botón **Cotizar en el backend** para validar que `OfferPricingService` de PHP produce exactamente el mismo total (misma descripción, mismo desglose de ajustes). El usuario puede marcar/desmarcar decoradores y el precio se recompone al instante.

**Código clave:**

```typescript
const api = EnergyApiService.getInstance();

// Decorator en el FRONTEND (TypeScript)
const local = offerPricingService.quote(20, 500, ['green', 'priority']);

// Decorator en el BACKEND (PHP): se valida que ambos coinciden
const backend = await api.quoteWithExtras({ kwh: 20, pricePerKwh: 500, extras: ['green', 'priority'] });
const sameTotal = Math.abs(local.total - backend.total) < 0.01;
```

---

# Patrón Composite

## ¿Qué es dentro del proyecto?

El **Composite** se usa para agrupar ofertas de energía en **paquetes** que pueden contener otras ofertas u otros paquetes, formando un árbol. `OfferLeaf` es la hoja (una oferta individual) y `EnergyBundle` es el compuesto (un nodo con hijos). Ambos implementan `BundleComponent`, de modo que el cliente recorre el árbol sin distinguir hojas de compuestos: los **totales de kWh y de precio se calculan recursivamente** sobre todo el subárbol.

Se aplica al subsistema de **compra y venta de excedentes** y al objetivo específico de gestionar los excedentes de forma organizada y extensible.

**Implementaciones actuales (2):**

- `EnergyBundle` + `OfferLeaf` + `BundleService` — Backend (PHP)
- `EnergyBundle` + `OfferLeaf` + `BundleService` — Frontend (TypeScript)

---

## 19. `EnergyBundle` / `OfferLeaf` / `BundleService` — Backend

**Archivos:** `backend-laravel/app/Patterns/Composite/BundleComponent.php`, `OfferLeaf.php`, `EnergyBundle.php` y `BundleService.php`

**En qué consiste dentro del proyecto:** `BundleComponent` es la interfaz común (`getName()`, `getTotalKwh()`, `getTotalPrice()`, `countLeaves()`, `getChildren()`, `toArray()`). `OfferLeaf` suma sus propios kWh y precio. `EnergyBundle` agrega hijos (`add()`) y calcula sus totales **recursivamente** como la suma de los totales de sus hijos, sin importar la profundidad. `BundleService` construye un árbol de demostración (`Paquete del Mercado` → dos paquetes hijos → ofertas) y expone `GET /api/energy/bundles/sample` y `POST /api/energy/bundles/evaluate` (evalúa un árbol JSON donde cada nodo declara `type: "offer"` o `type: "bundle"`).

**Diagrama UML:**

```
┌───────────────────────────────┐
│         «interface»           │
│        BundleComponent        │
├───────────────────────────────┤
│ + getName() : string          │
│ + getTotalKwh() : float       │
│ + getTotalPrice() : float     │
│ + countLeaves() : int         │
│ + getChildren() : array       │
└───────────────▲───────────────┘
                │ implementa
      ┌─────────┴──────────┐
      ▼                    ▼
┌─────────────┐   ┌──────────────────────────┐
│  OfferLeaf  │   │     EnergyBundle         │
│  (hoja: 1   │   │ - children : array       │
│  oferta)    │   │ + add(child)             │
└─────────────┘   │ + getTotalKwh() = Σ hijos│ (recursivo)
                  │ + getTotalPrice() = Σ hijos (recursivo)
                  └────────────┬─────────────┘
                               │ contiene 0..*
                               ▼
                        BundleComponent
                        (puede anidar bundles)
```

**Código clave:**

```php
$solar = new EnergyBundle('Paquete Solar');
$solar->add(new OfferLeaf('Paneles techo', 15, 480, 'solar'))
      ->add(new OfferLeaf('Excedente patio', 5, 500, 'solar'));

$market = new EnergyBundle('Paquete del Mercado');
$market->add($solar)->add($renewable);

echo $market->getTotalPrice(); // se calcula solo, sin importar la profundidad
```

---

## 20. `EnergyBundle` / `OfferLeaf` / `BundleService` — Frontend

**Archivos:** `frontend/src/patterns/composite/BundleComponent.ts`, `OfferLeaf.ts`, `EnergyBundle.ts`, `BundleService.ts` y `frontend/src/components/BundlePanel.tsx`

**En qué consiste dentro del proyecto:** La misma estructura del Composite en TypeScript. `BundlePanel` muestra el árbol con los totales recursivos calculados en el navegador, permite agregar una oferta nueva al paquete raíz (los totales se recalculan) y, al pulsar **Evaluar árbol en el backend**, envía el mismo árbol a `POST /api/energy/bundles/evaluate` para validar que el Composite de PHP produce los mismos totales.

**Código clave:**

```typescript
// Composite en el FRONTEND (TypeScript)
const local = bundleService.evaluate(tree);

// Composite en el BACKEND (PHP): se valida que ambos coinciden
const backend = await api.evaluateBundle(tree);
const sameTotal = Math.abs(local.totalPrice - backend.totalPrice) < 0.01;
```

---

# Patrón Facade

## ¿Qué es dentro del proyecto?

El **Facade** se usa en el proyecto para **unificar el acceso a los subsistemas de la plataforma** (compra y venta de excedentes, predicción de producción/consumo, dispositivos IoT y liquidaciones). Cada subsistema está compuesto por varios servicios y patrones: `MarketService`, `LoggerService` y `ConfigService` (Singleton), `DeviceMonitorService` (Adapter), `SettlementService` (Bridge), `OfferPricingService` (Decorator), `BundleService` (Composite) y `PredictorFactory` (Factory Method). Sin el Facade, el controlador y el frontend debían conocer **cada servicio y cada endpoint por separado** para operaciones simples de negocio.

El Facade resuelve esto con una **interfaz simplificada de alto nivel** de cinco operaciones:

- `getDashboard()` → panel unificado: mercado + ofertas disponibles + red IoT + configuración + actividad, en **una sola llamada**.
- `publishSurplus()` → publica un excedente: lo construye (Builder), lo registra, lo contabiliza y lo loguea.
- `buyEnergy()` → compra energía **y** emite su liquidación (Bridge) en la misma operación.
- `getSurplusAdvice()` → predicciones (Abstract Method) + contexto real del mercado + recomendación accionable.
- `getIoTNetworkStatus()` → inventario normalizado (Adapter) + resumen consolidado de la red.

Se aplica directamente a los objetivos específicos: gestionar la producción, el consumo y los excedentes; clasificar los tipos de energía (validados internamente por `EnergySourceFactory`); realizar compras y ventas; consultar el historial de transacciones; y apoyar la toma de decisiones con predicciones.

**Implementaciones actuales (2):**

- `EnergyPlatformFacade` — Backend (PHP)
- `PlatformFacade` — Frontend (TypeScript)

---

## 21. `EnergyPlatformFacade` — Backend

**Archivo:** `backend-laravel/app/Patterns/Facades/EnergyPlatformFacade.php`

**En qué consiste dentro del proyecto:** `EnergyPlatformFacade` es el **único punto de entrada** a los subsistemas. Su constructor arma las dependencias (los Singleton del mercado, logs y configuración; la fábrica de predictores; el monitor de dispositivos; el servicio de liquidaciones; el de extras y el de paquetes) y expone cinco operaciones de negocio. El controlador ya **no** inyecta cada servicio: solo recibe el Facade.

Internamente reutiliza los patrones ya implementados: `publishSurplus` construye la oferta con el **Builder** (`OfferDirector` + `EnergyOfferBuilder`) y valida el tipo con el **Factory Method** (`EnergySourceFactory`); `buyEnergy` compra en el mercado y emite la liquidación con el **Bridge** (`SettlementService`); `getSurplusAdvice` genera las predicciones con el **Abstract Method** (`PredictorFactory` + `AbstractPredictor`) ligadas al estado real del mercado; `getIoTNetworkStatus` usa el **Adapter** (`DeviceMonitorService`). Para liquidar la compra, el Facade localiza la oferta con `MarketService::getOfferById()` (añadido para este fin) y toma su precio.

**Endpoints del patrón Facade** (todos bajo `/api/energy/platform/*`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/energy/platform/dashboard` | Panel unificado: mercado, ofertas, red IoT, configuración y actividad en **una sola llamada** |
| POST | `/api/energy/platform/publish-surplus` | Publica un excedente: lo construye (Builder), registra, contabiliza y loguea |
| POST | `/api/energy/platform/buy` | Compra energía **y** emite su liquidación (Bridge) en la misma operación |
| GET | `/api/energy/platform/advice` | Asesoría de excedente: predicciones + mercado + recomendación accionable. Acepta `?production=&consumption=` |
| GET | `/api/energy/platform/iot-status` | Estado de la red IoT: resumen + inventario normalizado (Adapter) |

**Diagrama UML:**

```
┌────────────────────────────────────────────────────────────────┐
│                          «Facade»                                │
│                   EnergyPlatformFacade                           │
├────────────────────────────────────────────────────────────────┤
│ - market : MarketService          (Singleton)                   │
│ - logger : LoggerService          (Singleton)                   │
│ - config : ConfigService          (Singleton)                   │
│ - predictors : PredictorFactory   (Factory Method)              │
│ - devices : DeviceMonitorService  (Adapter)                     │
│ - settlements : SettlementService (Bridge)                      │
│ - pricing : OfferPricingService   (Decorator)                   │
│ - bundles : BundleService         (Composite)                   │
├────────────────────────────────────────────────────────────────┤
│ + getDashboard() : array                                           │
│ + publishSurplus(array) : array                                    │
│ + buyEnergy(int, float, str, str) : array                          │
│ + getSurplusAdvice(float, float) : array                           │
│ + getIoTNetworkStatus() : array                                    │
└──────┬─────────┬─────────┬─────────┬─────────┬──────────────────┘
       │         │         │         │         │  coordina
       ▼         ▼         ▼         ▼         ▼
 ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────────┐
 │ Market   ││ Logger   ││ Device   ││Settlement││ Predictor    │
 │ Service  ││ Service  ││ Monitor  ││ Service  ││ Factory +    │
 │(Singleton)││(Singleton)│ │(Adapter) ││ (Bridge) ││ AbstractPred.│
 └──────────┘└──────────┘└──────────┘└──────────┘└──────────────┘
       │         │                                     (también
       │         │                                      Decorator,
       │         │                                      Composite y
       │         │                                      ConfigService)
       │         └──────────┐
       ▼                    ▼
┌────────────────────────────────────────────────────────────────┐
│ «Client»  EnergyController                                       │
├────────────────────────────────────────────────────────────────┤
│ GET  /api/energy/platform/dashboard                             │
│ POST /api/energy/platform/publish-surplus                       │
│ POST /api/energy/platform/buy                                   │
│ GET  /api/energy/platform/advice                                │
│ GET  /api/energy/platform/iot-status                            │
│ El controlador conoce SOLO al Facade, no a los subsistemas.    │
└────────────────────────────────────────────────────────────────┘
```

**Código completo del Facade** (`EnergyPlatformFacade.php`):

```php
<?php

namespace App\Patterns\Facades;

use App\Models\EnergyOffer;
use App\Patterns\Adapters\DeviceGatewayRegistry;
use App\Patterns\Adapters\DeviceMonitorService;
use App\Patterns\Bridges\SettlementService;
use App\Patterns\Composite\BundleService;
use App\Patterns\ConfigService;
use App\Patterns\Decorators\OfferPricingService;
use App\Patterns\Factories\PredictorFactory;
use App\Patterns\LoggerService;
use App\Patterns\MarketService;
use App\Patterns\Proxies\MarketProxy;
use App\Patterns\Predictors\AbstractPredictor;

/**
 * Patron Facade.
 *
 * Proporciona una interfaz simplificada y unificada a los subsistemas
 * de la plataforma (mercado de excedentes, prediccion, dispositivos IoT,
 * liquidaciones, extras y paquetes de energia).
 *
 * El controlador y el frontend ya NO necesitan conocer cada servicio
 * interno (Singleton, Adapter, Bridge, Decorator, Composite, Factory
 * Method): el Facade es el unico punto de entrada y coordina todo.
 */
class EnergyPlatformFacade
{
    private MarketProxy $market;   // Proxy que envuelve al MarketService
    private LoggerService $logger;
    private ConfigService $config;
    private PredictorFactory $predictors;
    private DeviceMonitorService $devices;
    private SettlementService $settlements;
    private OfferPricingService $pricing;
    private BundleService $bundles;

    public function __construct()
    {
        // El Facade es el unico modulo que conoce a todos los
        // subsistemas internos y sus dependencias.
        // Patron Proxy: el Facade tambien pasa por MarketProxy para que la
        // cache del mercado se invalide en publicaciones y compras.
        $this->market = MarketProxy::getInstance();
        $this->logger = LoggerService::getInstance();
        $this->config = ConfigService::getInstance();
        $this->predictors = new PredictorFactory();

        $this->devices = new DeviceMonitorService((new DeviceGatewayRegistry())->all());
        $this->settlements = new SettlementService();
        $this->pricing = new OfferPricingService();
        $this->bundles = new BundleService();
    }

    /**
     * Panel unificado de la plataforma: UNA sola llamada agrega el
     * estado del mercado, las ofertas disponibles, la red IoT, la
     * configuracion global y la actividad reciente.
     */
    public function getDashboard(): array
    {
        return [
            'market' => $this->market->getMarketContext(),
            'offers' => array_map(
                fn(EnergyOffer $offer) => $offer->toArray(),
                $this->market->getAvailableOffers()
            ),
            'iot' => $this->devices->getSummary(),
            'config' => $this->config->getAll(),
            'activity' => $this->logger->getMetrics(),
        ];
    }

    /**
     * Publicar un excedente: construye la oferta (Builder), la registra
     * en el mercado, contabiliza la oferta y lo deja en el log.
     * El cliente envia los datos; el Facade orquesta el resto.
     */
    public function publishSurplus(array $data): array
    {
        $offer = $this->market->registerOffer($data);

        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada por {$offer->producerName} ({$offer->energyType}) via Facade");

        return [
            'offer' => $offer->toArray(),
            'market' => $this->market->getMarketContext(),
        ];
    }

    /**
     * Comprar energia: ejecuta la compra en el mercado y, en la misma
     * operacion, emite la liquidacion (Bridge) de la energia adquirida
     * segun el perfil y la moneda solicitados.
     */
    public function buyEnergy(int $offerId, float $kwh, string $profile = 'residential', string $currency = 'COP'): array
    {
        $purchase = $this->market->purchaseOffer($offerId, (int) round($kwh));

        if (!($purchase['success'] ?? false)) {
            return [
                'success' => false,
                'message' => $purchase['message'] ?? 'Compra fallida',
            ];
        }

        $this->logger->incrementTransactions();
        $this->logger->log("Compra de {$kwh} KWh en oferta #{$offerId} via Facade");

        // Liquidacion de la energia adquirida (Bridge) en la misma operacion.
        $offer = $this->market->getOfferById($offerId);
        $bill = $this->settlements->quote($profile, $currency, [
            'kwh' => $kwh,
            'pricePerKwh' => $offer?->pricePerKwh ?? 0.0,
        ]);

        return [
            'success' => true,
            'message' => $purchase['message'],
            'purchase' => [
                'offerId' => $offerId,
                'kwh' => $kwh,
                'pricePerKwh' => $offer?->pricePerKwh ?? 0.0,
            ],
            'bill' => $bill,
            'market' => $this->market->getMarketContext(),
        ];
    }

    /**
     * Asesoria de excedente: genera las predicciones (Abstract Method)
     * ligadas al estado real del mercado y resume la accion sugerida.
     */
    public function getSurplusAdvice(float $production, float $consumption): array
    {
        $marketContext = $this->market->getMarketContext();

        $predictions = array_map(
            fn(AbstractPredictor $predictor) => $predictor->predict(),
            $this->predictors->createAll($production, $consumption, $marketContext)
        );

        return [
            'predictions' => $predictions,
            'market' => $marketContext,
            'advice' => $this->buildAdvice($predictions, $marketContext),
        ];
    }

    /**
     * Estado de la red IoT: inventario normalizado (Adapter) y resumen
     * consolidado de la red domestica.
     */
    public function getIoTNetworkStatus(): array
    {
        return [
            'summary' => $this->devices->getSummary(),
            'devices' => $this->devices->listDevices(),
        ];
    }

    /**
     * Resumen accionable de la prediccion diaria para apoyar la
     * toma de decisiones (objetivo especifico de prediccion).
     */
    private function buildAdvice(array $predictions, array $marketContext): string
    {
        $daily = $predictions[0] ?? null;

        if ($daily === null) {
            return 'No hay datos suficientes para emitir una recomendacion.';
        }

        $available = $marketContext['totalAvailableKwh'] ?? 0;
        $activeOffers = $marketContext['activeOffers'] ?? 0;
        $avgPrice = $marketContext['avgPricePerKwh'] ?? 0;

        return match ($daily['action'] ?? 'none') {
            'publish' => "VENDER: publica el excedente estimado de {$daily['surplusEstimate']} kWh; el mercado promedia {$avgPrice} COP/kWh en {$activeOffers} ofertas activas.",
            'buy' => "COMPRAR: cubre el deficit estimado de {$daily['deficitEstimate']} kWh; el mercado dispone de {$available} kWh en {$activeOffers} ofertas activas.",
            default => 'EQUILIBRADO: tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.',
        };
    }
}
```

**Uso en `EnergyController`** (el controlador conoce solo al Facade):

```php
// Patron Facade: interfaz unificada a todos los subsistemas.
$this->platform = new EnergyPlatformFacade();

public function getPlatformDashboard(): JsonResponse
{
    // UNA sola llamada agrega mercado, ofertas, red IoT,
    // configuracion y actividad.
    return response()->json($this->platform->getDashboard());
}

public function buyEnergy(Request $request): JsonResponse
{
    $data = $request->validate([
        'offerId' => 'required|integer',
        'kwh' => 'required|numeric|min:0.1',
        'profile' => 'nullable|string|in:residential,commercial',
        'currency' => 'nullable|string|in:COP,USD,EUR',
    ]);

    // Compra en el mercado + liquidacion (Bridge), todo en una sola llamada.
    $result = $this->platform->buyEnergy(
        (int) $data['offerId'],
        (float) $data['kwh'],
        $data['profile'] ?? 'residential',
        $data['currency'] ?? 'COP',
    );

    return response()->json($result, $result['success'] ? 200 : 422);
}
```

**Ejemplo de respuesta del panel unificado** (una sola petición):

```json
{
  "market": {
    "totalOffers": 5,
    "activeOffers": 5,
    "totalAvailableKwh": 170,
    "avgPricePerKwh": 10900,
    "transactionCount": 1
  },
  "offers": [
    { "id": 1, "producerName": "Juan Perez", "totalKwh": 15, "availableKwh": 10, "pricePerKwh": 500, "energyType": "solar" }
  ],
  "iot": {
    "totalDevices": 4,
    "onlineDevices": 3,
    "offlineDevices": 1,
    "totalPowerKw": 2.021,
    "totalEnergyKwh": 1288.71,
    "devicesByProvider": { "legacy-scada": 2, "pv-inverter": 2 }
  },
  "config": {
    "marketName": "Plataforma de Comercio de Energia",
    "defaultPricePerKwh": 500,
    "currency": "COP",
    "maxOfferKwh": 1000
  },
  "activity": {
    "totalLogs": 12,
    "transactionCount": 1,
    "offerCount": 5,
    "recentLogs": ["[2026-10-10 12:00:00] Oferta creada por Juan Perez (solar) via Facade"]
  }
}
```

**Ejemplo de compra con liquidación incluida** (`POST /api/energy/platform/buy`):

```json
{
  "success": true,
  "message": "Compra exitosa de 5 KWh",
  "purchase": { "offerId": 1, "kwh": 5, "pricePerKwh": 500 },
  "bill": {
    "profile": "residential",
    "currency": "COP",
    "adjustments": [{ "label": "Subsidio residencial (5%)", "amount": -125 }],
    "total": 2375,
    "totalFormatted": "$ 2.375 COP",
    "totalMinorUnits": 2375
  },
  "market": { "totalOffers": 5, "activeOffers": 5, "totalAvailableKwh": 165, "avgPricePerKwh": 10900, "transactionCount": 2 }
}
```

---

## 22. `PlatformFacade` — Frontend

**Archivo:** `frontend/src/patterns/facade/PlatformFacade.ts`

**En qué consiste dentro del proyecto:** `PlatformFacade` es el Facade del navegador. Expone las mismas cinco operaciones de negocio de alto nivel y, internamente, **delega la comunicación HTTP en `EnergyApiService`** (el cliente Singleton que ya usa toda la aplicación), por lo que se reutiliza el mismo cliente y la misma URL base. Los componentes de React ya **no** construyen peticiones ni conocen los endpoints: piden operaciones de negocio al Facade.

El componente **`PlatformPanel` está ligado al sistema** y es su cliente: al montarse pide `loadDashboard()` (una sola petición que trae mercado, ofertas, red IoT, configuración y actividad), permite **publicar un excedente** (`publishSurplus`), **comprar energía** (`buyEnergy`, que además devuelve la liquidación en la moneda y el perfil elegidos) y **obtener la asesoría de excedente** (`getSurplusAdvice`, con predicciones diaria y semanal ligadas al mercado real). Tras cada operación el panel y el dashboard se refrescan automáticamente.

**Diagrama UML:**

```
┌────────────────────────────────────────────────────────────────┐
│                          «Facade»                                │
│                       PlatformFacade                             │
├────────────────────────────────────────────────────────────────┤
│ - api : EnergyApiService  (Singleton — cliente HTTP)            │
├────────────────────────────────────────────────────────────────┤
│ + loadDashboard() : Promise<PlatformDashboard>                   │
│ + publishSurplus(data) : Promise<{offer, market}>                │
│ + buyEnergy(id, kwh, profile, currency) : Promise<BuyResult>     │
│ + getSurplusAdvice(production, consumption) : Promise            │
│ + getIoTNetworkStatus() : Promise                                │
└───────────────────────────┬────────────────────────────────────┘
                            │  delega (misma instancia Singleton)
                            ▼
┌────────────────────────────────────────────────────────────────┐
│ «Subsistema»  EnergyApiService (Singleton)                       │
├────────────────────────────────────────────────────────────────┤
│ GET  /energy/platform/dashboard                                 │
│ POST /energy/platform/publish-surplus                           │
│ POST /energy/platform/buy                                       │
│ GET  /energy/platform/advice                                    │
│ GET  /energy/platform/iot-status                                │
└────────────────────────────────────────────────────────────────┘
                            ▲
                            │  usa SOLO al Facade
┌────────────────────────────────────────────────────────────────┐
│ «Client»  PlatformPanel (React)                                  │
├────────────────────────────────────────────────────────────────┤
│  • Panel unificado con UNA sola peticion                        │
│  • Publicar excedente · Comprar energia · Asesoria              │
│  • No conoce endpoints ni servicios internos                    │
└────────────────────────────────────────────────────────────────┘
```

**Código completo del Facade** (`PlatformFacade.ts`):

```typescript
import EnergyApiService from '../singleton/energy-api.service';
import type {
  BuyResult,
  DeviceInfo,
  EnergyOffer,
  PlatformDashboard,
  SettlementBill,
  SurplusAdvice,
  TelemetrySummary,
} from '../singleton/energy-api.service';
import type { MarketContext } from '../template/Predictor';

// Re-exporta los tipos de respuesta para los componentes.
export type {
  BuyResult,
  PlatformDashboard,
  SettlementBill,
  SurplusAdvice,
};

class PlatformFacade {
  private api = EnergyApiService.getInstance();

  /** Panel unificado: mercado, ofertas, red IoT, configuracion y actividad. */
  loadDashboard(): Promise<PlatformDashboard> {
    return this.api.getPlatformDashboard();
  }

  /** Publica un excedente: lo construye, registra y contabiliza. */
  publishSurplus(data: {
    producerName: string;
    totalKwh: number;
    pricePerKwh: number;
    energyType?: string;
    description?: string;
  }): Promise<{ offer: EnergyOffer; market: MarketContext }> {
    return this.api.publishSurplus(data);
  }

  /** Compra energia: compra en el mercado + liquidacion (Bridge). */
  buyEnergy(
    offerId: number,
    kwh: number,
    profile = 'residential',
    currency = 'COP'
  ): Promise<BuyResult> {
    return this.api.buyEnergy(offerId, kwh, profile, currency);
  }

  /** Asesoria de excedente: predicciones + mercado + recomendacion. */
  getSurplusAdvice(production = 0, consumption = 0): Promise<SurplusAdvice> {
    return this.api.getSurplusAdvice(production, consumption);
  }

  /** Estado de la red IoT: resumen + inventario normalizado (Adapter). */
  getIoTNetworkStatus(): Promise<{ summary: TelemetrySummary; devices: DeviceInfo[] }> {
    return this.api.getIoTNetworkStatus();
  }
}

// Se exporta una unica instancia compartida por los componentes.
const platformFacade = new PlatformFacade();
export default platformFacade;
```

**Métodos delegados en `EnergyApiService`** (el Facade no hace `fetch` directo; reutiliza el cliente Singleton):

```typescript
// EnergyApiService (Singleton) — subsistema HTTP del Facade
async getPlatformDashboard(): Promise<PlatformDashboard> {
  const response = await fetch(`${this.baseUrl}/energy/platform/dashboard`);
  if (!response.ok) throw new Error('Error al cargar el panel unificado');
  return response.json();
}

async buyEnergy(offerId: number, kwh: number, profile = 'residential', currency = 'COP'): Promise<BuyResult> {
  const response = await fetch(`${this.baseUrl}/energy/platform/buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerId, kwh, profile, currency }),
  });
  if (!response.ok) throw new Error('Error al comprar energia');
  return response.json();
}
```

**Uso ligado al sistema en `PlatformPanel` (React):**

```tsx
// El componente es el CLIENTE del Facade: no conoce endpoints.
import platformFacade from '../patterns/facade/PlatformFacade';

// UNA sola llamada trae todo el panel (mercado + IoT + config + actividad)
const loadDashboard = useCallback(async () => {
  setDashboard(await platformFacade.loadDashboard());
}, []);
useEffect(() => { loadDashboard(); }, [loadDashboard]);

// Publicar excedente: el Facade construye, registra y contabiliza
const handlePublish = async () => {
  const result = await platformFacade.publishSurplus({
    producerName: producerName.trim(),
    totalKwh: parseFloat(kwh),
    pricePerKwh: parseFloat(price),
    energyType,
    description: description.trim(),
  });
  setMessage(`Oferta #${result.offer.id} de ${result.offer.energyType} publicada via Facade.`);
  onSystemChanged?.();        // refresca el dashboard global
  await loadDashboard();      // refresca el panel unificado
};

// Comprar energia: el Facade compra y liquida (Bridge) en la misma operacion
const handleBuy = async () => {
  const result = await platformFacade.buyEnergy(selectedOfferId, parseFloat(buyKwh), profile, currency);
  setLastBuy(result);
  setMessage(result.message);
  // result.bill.totalFormatted -> "$ 2.375 COP" (liquidacion incluida)
  onSystemChanged?.();
  await loadDashboard();
};

// Asesoria de excedente: predicciones + mercado + recomendacion accionable
const handleAdvice = async () => {
  const result = await platformFacade.getSurplusAdvice(
    parseFloat(production) || 0,
    parseFloat(consumption) || 0
  );
  setAdvice(result);
  // result.advice -> "VENDER: publica el excedente estimado de 8 kWh; ..."
};
```

---

<a id="patron-flyweight"></a>

# Patrón Flyweight

## ¿Qué es dentro del proyecto?

El **Flyweight** se usa en el proyecto para **compartir la información que se repite** entre las ofertas de energía. Todas las ofertas de un mismo tipo (solar, eólica o hidráulica) comparten el mismo nombre, descripción, eficiencia, color e imagen; si esa información se almacenara dentro de cada `EnergyOffer`, se duplicaría cientos de veces.

El patrón separa dos tipos de estado:

| Tipo de estado | Qué contiene | Dónde vive |
|----------------|--------------|------------|
| **Intrínseco** (compartido) | `type`, `name`, `description`, `efficiency`, `color` y, en el frontend, `emoji`, `image`, `accentBg`, `accentBorder`, `accentText` | Pool del Flyweight: **una sola instancia por tipo** |
| **Extrínseco** (único) | `id`, `producerName`, `totalKwh`, `availableKwh`, `pricePerKwh`, `createdAt` | Cada `EnergyOffer` / cada oferta del frontend |

De esta forma, **N ofertas reutilizan 3 descriptores** (uno por tipo) en lugar de crear N descriptores. El pool se implementa en dos capas:

- **Backend (PHP):** `EnergySourceFlyweightFactory` comparte instancias de `EnergySource` y las usa para **enriquecer** las ofertas con `energySource`.
- **Frontend (TypeScript):** `EnergyTypeFlyweightFactory` comparte los descriptores visuales que usan `EnergyDashboard` y `PatternsPanel` para mostrar nombre, imagen, colores y emoji.

Ambos pools son **Singleton** (una única instancia por proceso). El pool del backend se apoya en el **Factory Method** (`EnergySourceFactory`) para crear los descriptores canónicos una sola vez; el pool del frontend siembra directamente sus descriptores visuales. Esto demuestra cómo los patrones se combinan: el Flyweight **comparte**, el Factory Method **crea** y el Singleton **garantiza el pool único**.

**Implementaciones actuales (2):**

- `EnergySourceFlyweightFactory` — Backend (PHP)
- `EnergyTypeFlyweightFactory` — Frontend (TypeScript)

**¿Por qué Flyweight y no guardar el descriptor en cada oferta?**

- Porque el descriptor es **idéntico** para todas las ofertas del mismo tipo: repetirlo no aporta información nueva.
- Porque el estado que cambia (productor, kWh, precio, fecha) es **extrínseco** y se mantiene separado.
- Porque añadir un tipo nuevo solo crea **un descriptor más** en el pool; las ofertas existentes no cambian.

---

## 23. `EnergySourceFlyweightFactory` — Backend

**Archivo:** `backend-laravel/app/Patterns/Flyweights/EnergySourceFlyweightFactory.php`

**En qué consiste dentro del proyecto:** es el **pool de flyweights** del backend. Mantiene un arreglo `pool[tipo] → EnergySource` con los tres descriptores canónicos (`solar`, `wind`, `hydro`). Cuando una oferta necesita su descriptor, `describe($type)` devuelve el **mismo objeto** del pool; no se crea uno nuevo por oferta. El estado extrínseco permanece en `EnergyOffer`.

**Cómo funciona:**

1. `getInstance()` crea el pool una sola vez (Singleton).
2. En el constructor, `load()` recupera las métricas acumuladas de `storage/app/flyweight_data.json`.
3. `seedPool()` crea los tres descriptores canónicos usando `(new EnergySourceFactory())->create($type)` (Factory Method). Solo ocurre una vez por instancia.
4. `get($type)` devuelve la instancia compartida del pool. Si el tipo no estuviera en el pool, intenta crearlo con la fábrica; cualquier tipo distinto de `solar`, `wind` o `hydro` provoca una excepción de la fábrica.
5. Cada llamada a `get()` incrementa `totalUses` y `usesByType`, y persiste las métricas.
6. `describe($type)` devuelve `toArray()` del descriptor; `EnergyController` lo usa para enriquecer cada oferta.
7. `getStats()` expone las métricas: instancias compartidas, usos totales, instancias ahorradas, usos por tipo y descriptores del pool.

**Diagrama UML:**

```
┌─────────────────────────────────────────────────────────────┐
│                    «FlyweightFactory»                       │
│              EnergySourceFlyweightFactory                   │
├─────────────────────────────────────────────────────────────┤
│ - instance : ?EnergySourceFlyweightFactory  (Singleton)     │
│ - pool : array<string, EnergySource>                        │
│ - metrics : { totalUses, usesByType }                       │
├─────────────────────────────────────────────────────────────┤
│ + getInstance() : self                                      │
│ + get(type) : EnergySource        ← MISMA instancia         │
│ + describe(type) : array                                    │
│ + getStats() : array                                        │
└───────────────┬─────────────────────────────────────────────┘
                │ crea una vez por tipo
                ▼
     ┌─────────────────────────┐
     │ «Factory Method»        │
     │ EnergySourceFactory     │
     ├─────────────────────────┤
     │ solar → SolarEnergy     │
     │ wind  → WindEnergy      │
     │ hydro → HydroEnergy     │
     └─────────────────────────┘

Ofertas (N) ──usan──▶ descriptor compartido (3 instancias)
```

**Código completo** (`EnergySourceFlyweightFactory.php`):

```php
<?php

namespace App\Patterns\Flyweights;

use App\Patterns\EnergySources\EnergySource;
use App\Patterns\Factories\EnergySourceFactory;

/**
 * Patron Flyweight.
 *
 * Comparte UNA SOLA instancia de EnergySource por cada tipo de energia
 * (solar, wind, hydro). El estado intrinseco (nombre, descripcion,
 * eficiencia y color del tipo) vive en el flyweight y es el mismo para
 * todas las ofertas; el estado extrinseco (productor, kWh, precio,
 * fecha) vive fuera, en cada EnergyOffer.
 *
 * De esta forma, cientos de ofertas reutilizan 3 instancias en lugar de
 * instanciar un descriptor nuevo por cada oferta.
 */
class EnergySourceFlyweightFactory
{
    private static ?EnergySourceFlyweightFactory $instance = null;

    /** @var array<string, EnergySource> Pool de flyweights canonicos por tipo. */
    private array $pool = [];

    private string $dataFile;

    /** @var array{totalUses:int,usesByType:array<string,int>} */
    private array $metrics = [
        'totalUses' => 0,
        'usesByType' => [],
    ];

    private function __construct()
    {
        $this->dataFile = storage_path('app/flyweight_data.json');
        $this->load();
        $this->seedPool();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Crea los flyweights canonicos UNA vez apoyandose en el Factory Method
     * (EnergySourceFactory). A partir de aqui siempre se comparten.
     */
    private function seedPool(): void
    {
        foreach (EnergySourceFactory::TYPES as $type) {
            if (!isset($this->pool[$type])) {
                $this->pool[$type] = (new EnergySourceFactory())->create($type);
            }
        }
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $data = json_decode(file_get_contents($this->dataFile), true) ?? [];
            $this->metrics = array_merge($this->metrics, $data['metrics'] ?? []);
        }
    }

    private function save(): void
    {
        file_put_contents($this->dataFile, json_encode(
            ['metrics' => $this->metrics],
            JSON_PRETTY_PRINT
        ));
    }

    /**
     * Devuelve el flyweight COMPARTIDO del tipo pedido. Si el tipo no
     * pertenece al catalogo base se delega en el Factory Method.
     */
    public function get(string $type): EnergySource
    {
        $key = strtolower(trim($type));

        if (!isset($this->pool[$key])) {
            // Tipo fuera del catalogo base: se crea y se comparte tambien.
            $this->pool[$key] = (new EnergySourceFactory())->create($key);
        }

        // Cada uso reutiliza la MISMA instancia (cache hit del pool).
        $this->metrics['totalUses']++;
        $this->metrics['usesByType'][$key] = ($this->metrics['usesByType'][$key] ?? 0) + 1;
        $this->save();

        return $this->pool[$key];
    }

    /** Estado compartido del tipo, listo para enriquecer una oferta. */
    public function describe(string $type): array
    {
        return $this->get($type)->toArray();
    }

    /** Metricas del pool: instancias compartidas vs. usos acumulados. */
    public function getStats(): array
    {
        $shared = count($this->pool);

        return [
            'createdInstances' => $shared,
            'totalUses' => $this->metrics['totalUses'],
            'savedInstances' => max(0, $this->metrics['totalUses'] - $shared),
            'usesByType' => $this->metrics['usesByType'],
            'sharedTypes' => array_values(array_map(
                fn (EnergySource $source) => [
                    'type' => $source->getType(),
                    'name' => $source->getName(),
                    'color' => $source->getColor(),
                ],
                $this->pool
            )),
            'note' => 'Sin Flyweight, cada uso crearia una instancia nueva (1 por oferta/consulta). '
                . 'Con Flyweight, todos los usos comparten las mismas instancias del pool (una por tipo).',
        ];
    }
}
```

**Integración con el sistema:**

| Punto de integración | Qué hace |
|----------------------|----------|
| `EnergyController::getAvailableOffers()` | Pide las ofertas al `MarketProxy` y añade `energySource` con `describe($offer['energyType'])` |
| `EnergyController::getFlyweightStats()` | Devuelve `getStats()` para el panel de patrones |
| `GET /api/energy/offers` | Cada oferta incluye su descriptor compartido |
| `GET /api/energy/flyweight-stats` | Métricas del pool (instancias compartidas vs. usos) |
| `PatternsPanel` (React) | Muestra los descriptores y las métricas del backend |

```php
// EnergyController::getAvailableOffers()
$offers = array_map(
    fn ($o) => $o->toArray(),
    $this->marketProxy->getAvailableOffers()
);

// Patron Flyweight: enriquece cada oferta con su descriptor compartido.
$offers = array_map(function (array $offer) {
    $type = $offer['energyType'] ?? '';
    if ($type === '') {
        return $offer;
    }

    return array_merge(
        $offer,
        ['energySource' => $this->sourceFlyweights->describe($type)]
    );
}, $offers);
```

**Ejemplo de respuesta** (`GET /api/energy/offers`, oferta enriquecida):

```json
[
  {
    "id": 1,
    "producerName": "Oscar",
    "energyType": "wind",
    "totalKwh": 50,
    "availableKwh": 43,
    "pricePerKwh": 450,
    "description": "Excedente del aerogenerador",
    "createdAt": "2026-10-19 10:00:00",
    "energySource": {
      "type": "wind",
      "name": "Energia Eolica",
      "description": "Aprovecha el viento mediante aerogeneradores para producir electricidad renovable.",
      "efficiency": 70,
      "color": "#3498db"
    }
  }
]
```

**Métricas** (`GET /api/energy/flyweight-stats`):

```json
{
  "createdInstances": 3,
  "totalUses": 12,
  "savedInstances": 9,
  "usesByType": {
    "wind": 7,
    "solar": 3,
    "hydro": 2
  },
  "sharedTypes": [
    { "type": "solar", "name": "Energia Solar", "color": "#f39c12" },
    { "type": "wind", "name": "Energia Eolica", "color": "#3498db" },
    { "type": "hydro", "name": "Energia Hidraulica", "color": "#2ecc71" }
  ],
  "note": "Sin Flyweight, cada uso crearia una instancia nueva..."
}
```

> **Lectura de las métricas:** `createdInstances` son los descriptores del pool (3, uno por tipo); `totalUses` son las veces que las ofertas/consultas pidieron un descriptor; `savedInstances` es la diferencia, es decir, las instancias que **no** hubo que crear gracias al Flyweight. `usesByType` muestra qué tipos se están reutilizando más.

---

## 24. `EnergyTypeFlyweightFactory` — Frontend

**Archivo:** `frontend/src/patterns/flyweight/EnergyTypeFlyweightFactory.ts`

**En qué consiste dentro del proyecto:** es el **pool de descriptores visuales** del frontend. Mantiene un `Map<string, EnergyTypeDescriptor>` con una instancia por tipo de energía. Todos los componentes que muestran una oferta acceden al **mismo descriptor** para obtener nombre, imagen, color, emoji y estilos de acento. El estado extrínseco (productor, kWh, precio, fecha) sigue viviendo en cada oferta que llega del backend.

**Campos del descriptor compartido:**

| Campo | Ejemplo (`solar`) | Uso en la interfaz |
|-------|-------------------|--------------------|
| `type` | `solar` | Clave del pool |
| `name` | `Energia Solar` | Etiqueta visible |
| `description` | `Captura la luz del sol...` | Texto descriptivo |
| `efficiency` | `85` | Indicador de eficiencia |
| `color` | `#f39c12` | Color principal del tipo |
| `emoji` | `☀️` | Icono en tarjetas y badges |
| `image` | `/images/solar-energy.svg` | Imagen de la oferta |
| `accentBg` | `#fdf3e3` | Fondo de badges |
| `accentBorder` | `#f39c12` | Borde de badges |
| `accentText` | `#7a5200` | Texto de badges |

**Cómo funciona:**

1. `getInstance()` devuelve la única instancia del pool (Singleton).
2. `seed()` carga los tres descriptores canónicos (`solar`, `wind`, `hydro`) con todos sus campos visuales.
3. `get($type)` devuelve el descriptor compartido o `null` si el tipo no existe.
4. `ensure($type)` devuelve el descriptor y, si el tipo es desconocido, cae en `solar` para no romper la interfaz.
5. `getName()`, `getImage()` y `getColor()` son atajos que usan los componentes.
6. `list()` devuelve los tres descriptores para el panel de patrones.
7. `describe($type)` devuelve el descriptor completo cuando se necesita.

**Diagrama UML:**

```
┌─────────────────────────────────────────────────────────────┐
│                    «FlyweightFactory»                       │
│              EnergyTypeFlyweightFactory                     │
├─────────────────────────────────────────────────────────────┤
│ - instance : EnergyTypeFlyweightFactory  (Singleton)        │
│ - pool : Map<string, EnergyTypeDescriptor>                  │
├─────────────────────────────────────────────────────────────┤
│ + getInstance() : EnergyTypeFlyweightFactory                │
│ + get(type) : EnergyTypeDescriptor | null                   │
│ + ensure(type) : EnergyTypeDescriptor                       │
│ + getName(type) / getImage(type) / getColor(type)           │
│ + list() : EnergyTypeDescriptor[]                           │
└─────────────────────────────────────────────────────────────┘
          ▲                         ▲
          │                         │
   EnergyDashboard            PatternsPanel
   (imagen, nombre)           (badges y lista)
```

**Código completo** (`EnergyTypeFlyweightFactory.ts`):

```typescript
import type { EnergySource as _EnergySource } from '../factory/types';

export interface EnergyTypeDescriptor {
  type: string;
  name: string;
  description: string;
  efficiency: number;
  color: string;
  emoji: string;
  image: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

/**
 * Patron Flyweight (frontend).
 *
 * Reutiliza descriptores compartidos por tipo de energia (solar, wind, hydro).
 * Cada componente que muestre el mismo tipo accede a la MISMA instancia.
 */
class EnergyTypeFlyweightFactory {
  private static instance: EnergyTypeFlyweightFactory;
  private readonly pool = new Map<string, EnergyTypeDescriptor>();

  private constructor() {
    this.seed();
  }

  static getInstance(): EnergyTypeFlyweightFactory {
    if (!EnergyTypeFlyweightFactory.instance) {
      EnergyTypeFlyweightFactory.instance = new EnergyTypeFlyweightFactory();
    }
    return EnergyTypeFlyweightFactory.instance;
  }

  private seed() {
    this.pool.set('solar', {
      type: 'solar',
      name: 'Energia Solar',
      description: 'Captura la luz del sol mediante paneles fotovoltaicos para generar electricidad de forma limpia.',
      efficiency: 85,
      color: '#f39c12',
      emoji: '☀️',
      image: '/images/solar-energy.svg',
      accentBg: '#fdf3e3',
      accentBorder: '#f39c12',
      accentText: '#7a5200',
    });
    this.pool.set('wind', {
      type: 'wind',
      name: 'Energia Eolica',
      description: 'Aprovecha el viento mediante aerogeneradores para producir electricidad renovable.',
      efficiency: 70,
      color: '#3498db',
      emoji: '🌬️',
      image: '/images/wind-energy.svg',
      accentBg: '#eaf4fb',
      accentBorder: '#3498db',
      accentText: '#1f5a85',
    });
    this.pool.set('hydro', {
      type: 'hydro',
      name: 'Energia Hidraulica',
      description: 'Convierte la energia del agua en movimiento en electricidad aprovechando embalses y corrientes.',
      efficiency: 92,
      color: '#2ecc71',
      emoji: '💧',
      image: '/images/hydro-energy.svg',
      accentBg: '#e9f9f0',
      accentBorder: '#2ecc71',
      accentText: '#1c6b3f',
    });
  }

  get(type?: string | null): EnergyTypeDescriptor | null {
    if (!type) return null;
    const key = type.toLowerCase();
    return this.pool.get(key) ?? null;
  }

  ensure(type?: string | null): EnergyTypeDescriptor {
    const found = this.get(type);
    if (found) return found;
    return this.get('solar')!;
  }

  getName(type?: string | null): string {
    return this.get(type)?.name ?? (type ?? '').toString();
  }

  getImage(type?: string | null): string {
    return this.get(type)?.image ?? '/images/renewable-landscape.svg';
  }

  getColor(type?: string | null): string {
    return this.get(type)?.color ?? '#888';
  }

  describe(type?: string | null): EnergyTypeDescriptor | null {
    return this.get(type);
  }

  list(): EnergyTypeDescriptor[] {
    return Array.from(this.pool.values());
  }
}

const energyTypeFlyweightFactory = EnergyTypeFlyweightFactory.getInstance();
export default energyTypeFlyweightFactory;
export { EnergyTypeFlyweightFactory };
```

**Integración con el sistema:**

| Punto de integración | Qué hace |
|----------------------|----------|
| `EnergyDashboard.tsx` | Usa `getImage()` y `getName()` para mostrar la imagen y la etiqueta de cada oferta |
| `PatternsPanel.tsx` | Usa `list()` para pintar los tres badges y mostrar los descriptores compartidos |
| `EnergyApiProxy` / `EnergyApiService` | Traen las ofertas del backend; el descriptor visual se resuelve localmente con el pool |

```tsx
// EnergyDashboard.tsx — la misma instancia para todas las tarjetas
import energyTypeFlyweightFactory from '../patterns/flyweight/EnergyTypeFlyweightFactory';

<img
  src={energyTypeFlyweightFactory.getImage(offer.energyType)}
  alt={energyTypeFlyweightFactory.getName(offer.energyType)}
/>

{offer.energyType && (
  <span className="offer-type">
    {energyTypeFlyweightFactory.getName(offer.energyType)}
  </span>
)}
```

```tsx
// PatternsPanel.tsx — lista los descriptores compartidos del pool
const fly = energyTypeFlyweightFactory;

{fly.list().map((d) => (
  <span
    key={d.type}
    style={{
      backgroundColor: d.accentBg,
      color: d.accentText,
      borderColor: d.accentBorder,
    }}
  >
    {d.emoji} {d.name}
  </span>
))}
```

**Comparativa backend vs. frontend:**

| Aspecto | Backend (PHP) | Frontend (TS) |
|---------|---------------|----------------|
| Pool | `array<string, EnergySource>` | `Map<string, EnergyTypeDescriptor>` |
| Estado intrínseco | Tipo, nombre, descripción, eficiencia, color | Los anteriores + emoji, imagen y estilos |
| Estado extrínseco | `EnergyOffer` | Objeto `EnergyOffer` que llega de la API |
| Métricas | `getStats()` con usos y ahorro | `list()` para mostrar los descriptores |
| Uso principal | Enriquecer la respuesta de `/offers` | Pintar tarjetas, badges e imágenes |

---

<a id="patron-proxy"></a>

# Patrón Proxy

## ¿Qué es dentro del proyecto?

El **Proxy** se usa para **controlar el acceso al mercado de energía** sin cambiar el contrato de `MarketService`. El cliente sigue llamando a los mismos métodos (`getAvailableOffers()`, `purchaseOffer()`, etc.), pero el Proxy intercepta la llamada para añadir tres responsabilidades:

1. **Proxy virtual:** crear el objeto real (`MarketService`) **solo cuando se necesita**, no en el constructor.
2. **Proxy de caché:** servir la lista de ofertas desde una caché con **TTL** (`offersCacheTtl`, 10 segundos por defecto) y **invalidarla** cuando el mercado cambia (publicar, clonar, comprar).
3. **Proxy de protección:** validar cada compra contra la política de `ConfigService` (**mínimo 1 kWh, máximo 100 kWh**) y **bloquear** las operaciones fuera de rango antes de llegar al sujeto real.

El patrón se implementa en las dos capas:

- **Backend (PHP):** `MarketProxy` envuelve al `MarketService` (Singleton) y es el punto de acceso que usa `EnergyController` y `EnergyPlatformFacade`.
- **Frontend (TypeScript):** `EnergyApiProxy` envuelve al `EnergyApiService` (Singleton), cachea las ofertas 10 segundos y valida las compras antes de enviarlas al backend.

**Implementaciones actuales (2):**

- `MarketProxy` — Backend (PHP)
- `EnergyApiProxy` — Frontend (TypeScript)

**Las tres facetas del Proxy en el proyecto:**

| Faceta | Backend (`MarketProxy`) | Frontend (`EnergyApiProxy`) |
|--------|-------------------------|-----------------------------|
| **Virtual** | `real()` crea `MarketService` al primer acceso | El cliente HTTP se obtiene del Singleton al construir el Proxy |
| **Caché** | `getAvailableOffers()` + `market_proxy_cache.json` + TTL configurable | `offersCache` en memoria + TTL de 10 000 ms |
| **Protección** | `purchaseOffer()` valida mínimo/máximo desde `ConfigService` | `purchaseOffer()` valida 1–100 kWh antes de llamar a la API |

**¿Por qué Proxy y no llamar directamente al servicio real?**

- Porque consultar el mercado en cada petición es costoso y repetitivo; la caché evita recorrer las ofertas cuando no han cambiado.
- Porque las compras necesitan una **política de seguridad** centralizada; el Proxy la aplica antes del sujeto real.
- Porque el cliente no debe cambiar: el Proxy expone **el mismo contrato** y puede sustituir al servicio real de forma transparente.
- Porque la inicialización diferida evita crear el mercado si la petición no lo necesita.

**Diferencia con otros patrones del proyecto:**

| Patrón | Diferencia clave |
|--------|------------------|
| **Proxy vs. Decorator** | El Decorator **añade** comportamiento al resultado; el Proxy **controla el acceso** sin cambiar el resultado de negocio. |
| **Proxy vs. Facade** | El Facade **simplifica** muchos subsistemas con una interfaz nueva; el Proxy sustituye **un** objeto con el mismo contrato. |
| **Proxy vs. Adapter** | El Adapter **traduce** interfaces incompatibles; el Proxy mantiene la interfaz del sujeto real. |

---

## 25. `MarketProxy` — Backend

**Archivo:** `backend-laravel/app/Patterns/Proxies/MarketProxy.php`

**En qué consiste dentro del proyecto:** es el **sustituto transparente** de `MarketService`. `EnergyController` y `EnergyPlatformFacade` lo usan como si fuera el mercado real, pero el Proxy decide si responde desde la caché, si crea el sujeto real o si bloquea una compra. También es un **Singleton**, para que la caché y las políticas sean únicas en todo el proceso.

**Métodos principales:**

| Método | Responsabilidad |
|--------|-----------------|
| `getInstance()` | Devuelve la única instancia del Proxy |
| `real()` | Proxy virtual: crea `MarketService` solo al primer acceso |
| `getAvailableOffers()` | Cache hit → devuelve ofertas cacheadas; cache miss → consulta el mercado y cachea |
| `purchaseOffer($id, $kwh)` | Valida mínimo/máximo, delega en el mercado e invalida la caché si la compra fue exitosa |
| `registerOffer()` / `registerExpressOffer()` | Delegan en el mercado e invalidan la caché |
| `cloneOffer()` / `createOfferFromTemplate()` | Delegan en el mercado e invalidan la caché |
| `getOfferById()` / `getMetrics()` / `getMarketContext()` | Delegación transparente |
| `invalidateCache()` | Borra la caché en memoria y el archivo `market_proxy_cache.json` |
| `getCacheStatus()` | Estado de la caché para `GET /api/energy/proxy-stats` |

**Cómo funciona la caché:**

1. En el primer `getAvailableOffers()`, el Proxy consulta `MarketService`, convierte las ofertas a arreglos y escribe `market_proxy_cache.json` con `offers` y `expiresAt = time() + offersCacheTtl`.
2. En las siguientes peticiones, si `time() < expiresAt`, devuelve las ofertas del archivo **sin tocar** `MarketService` (cache hit) y lo registra en el log.
3. Cuando el TTL expira, vuelve a consultar el mercado (cache miss) y reescribe la caché.
4. Cualquier mutación (`registerOffer`, `registerExpressOffer`, `cloneOffer`, `createOfferFromTemplate`, `purchaseOffer` exitosa) llama a `invalidateCache()`, de modo que la siguiente lectura vea el estado actualizado.

**Diagrama UML:**

```
                    ┌──────────────────────────────────┐
                    │            «Client»              │
                    │  EnergyController                │
                    │  EnergyPlatformFacade            │
                    └───────────────┬──────────────────┘
                                    │ getAvailableOffers()
                                    │ purchaseOffer(id, kwh)
                                    ▼
                    ┌──────────────────────────────────┐
                    │            «Proxy»               │
                    │           MarketProxy            │
                    ├──────────────────────────────────┤
                    │ - real : ?MarketService          │
                    │ - cache : ?array                 │
                    │ - cacheFile : string             │
                    ├──────────────────────────────────┤
                    │ + getAvailableOffers() : array   │
                    │ + purchaseOffer(id, kwh) : array │
                    │ + registerOffer(data)            │
                    │ + cloneOffer(id, adj)            │
                    │ + invalidateCache()              │
                    │ + getCacheStatus() : array       │
                    └───────┬──────────────────┬───────┘
                            │                  │
             cache hit      │                  │ cache miss / mutación
                            ▼                  ▼
              ┌──────────────────────┐   ┌──────────────────────────┐
              │ market_proxy_cache   │   │      «RealSubject»       │
              │      .json           │   │      MarketService       │
              │ offers + expiresAt   │   │      (Singleton)         │
              └──────────────────────┘   └──────────────────────────┘
                            ▲
                            │ política
              ┌─────────────┴─────────────┐
              │      ConfigService        │
              │ offersCacheTtl = 10       │
              │ minPurchaseKwh = 1        │
              │ maxPurchaseKwh = 100      │
              └───────────────────────────┘
```

**Código completo** (`MarketProxy.php`):

```php
<?php

namespace App\Patterns\Proxies;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;
use App\Patterns\LoggerService;
use App\Patterns\MarketService;

/**
 * Patron Proxy.
 *
 * Sustituto transparente de MarketService que controla el acceso al
 * mercado. Combina tres facetas del Proxy sobre la MISMA interfaz:
 *
 *  - Proxy virtual: solo instancia MarketService cuando hace falta.
 *  - Proxy de caché: cachea las ofertas disponibles durante unos
 *    segundos (TTL) para no recorrer el mercado en cada petición y
 *    invalida la caché cuando el mercado cambia.
 *  - Proxy de protección: valida cada compra contra ConfigService
 *    (cantidad mínima y máximo por operación) y bloquea las compras
 *    fuera de política antes de llegar al sujeto real.
 *
 * El cliente (EnergyController) sigue llamando a los mismos métodos que
 * expondría MarketService: el Proxy no cambia el contrato.
 */
class MarketProxy
{
    private static ?MarketProxy $instance = null;

    private ?MarketService $real = null;

    /** @var array{offers:array,expiresAt:int}|null Caché de ofertas en disco. */
    private ?array $cache = null;

    private string $cacheFile;

    private function __construct()
    {
        $this->cacheFile = storage_path('app/market_proxy_cache.json');
        $this->loadCache();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // ------------------------------------------------------------------
    // Proxy virtual: el sujeto real se crea solo al primer acceso.
    // ------------------------------------------------------------------

    private function real(): MarketService
    {
        if ($this->real === null) {
            $this->real = MarketService::getInstance();
        }
        return $this->real;
    }

    // ------------------------------------------------------------------
    // Proxy de caché: ofertas disponibles con TTL.
    // ------------------------------------------------------------------

    private function loadCache(): void
    {
        if (file_exists($this->cacheFile)) {
            $this->cache = json_decode(file_get_contents($this->cacheFile), true);
        }
    }

    private function ttl(): int
    {
        return (int) ConfigService::getInstance()->get('offersCacheTtl');
    }

    private function isCacheValid(): bool
    {
        return $this->cache !== null
            && isset($this->cache['expiresAt'])
            && time() < (int) $this->cache['expiresAt'];
    }

    private function writeCache(array $offers): void
    {
        $this->cache = [
            'offers' => $offers,
            'expiresAt' => time() + $this->ttl(),
        ];
        file_put_contents($this->cacheFile, json_encode($this->cache, JSON_PRETTY_PRINT));
    }

    /** Invalida la caché (llamado tras cualquier mutación del mercado). */
    public function invalidateCache(): void
    {
        $this->cache = null;
        if (file_exists($this->cacheFile)) {
            unlink($this->cacheFile);
        }
    }

    public function getAvailableOffers(): array
    {
        if ($this->isCacheValid()) {
            // Cache hit: no se toca el mercado real.
            LoggerService::getInstance()->log('Proxy: ofertas servidas desde la caché (cache hit)');
            return array_map(function (array $offer) {
                $e = new EnergyOffer();
                $e->id = $offer['id'];
                $e->producerName = $offer['producerName'];
                $e->totalKwh = $offer['totalKwh'];
                $e->availableKwh = $offer['availableKwh'];
                $e->pricePerKwh = $offer['pricePerKwh'];
                $e->description = $offer['description'];
                $e->energyType = $offer['energyType'];
                $e->createdAt = $offer['createdAt'];
                return $e;
            }, $this->cache['offers']);
        }

        // Cache miss: se consulta el sujeto real y se cachea el resultado.
        $offers = array_values($this->real()->getAvailableOffers());
        $this->writeCache(array_map(fn (EnergyOffer $o) => $o->toArray(), $offers));

        return $offers;
    }

    // ------------------------------------------------------------------
    // Proxy de protección: toda compra pasa primero por la política.
    // ------------------------------------------------------------------

    public function purchaseOffer(int $id, int $kwh): array
    {
        $config = ConfigService::getInstance();
        $minKwh = (float) $config->get('minPurchaseKwh');
        $maxKwh = (float) $config->get('maxPurchaseKwh');

        if ($kwh < $minKwh) {
            LoggerService::getInstance()->log("Proxy: compra bloqueada ({$kwh} kWh < mínimo {$minKwh})");
            return [
                'success' => false,
                'message' => "Proxy de seguridad: la compra mínima es {$minKwh} kWh",
            ];
        }

        if ($kwh > $maxKwh) {
            LoggerService::getInstance()->log("Proxy: compra bloqueada ({$kwh} kWh > máximo {$maxKwh})");
            return [
                'success' => false,
                'message' => "Proxy de seguridad: no se pueden comprar más de {$maxKwh} kWh por operación",
            ];
        }

        // Política cumplida: se delega en el sujeto real y se invalida la caché.
        $result = $this->real()->purchaseOffer($id, $kwh);

        if ($result['success']) {
            $this->invalidateCache();
        }

        return $result;
    }

    // ------------------------------------------------------------------
    // Resto de la interfaz: delegación transparente en el sujeto real.
    // ------------------------------------------------------------------

    public function registerOffer(array $data): EnergyOffer
    {
        $offer = $this->real()->registerOffer($data);
        $this->invalidateCache();
        return $offer;
    }

    public function registerExpressOffer(array $data): EnergyOffer
    {
        $offer = $this->real()->registerExpressOffer($data);
        $this->invalidateCache();
        return $offer;
    }

    public function cloneOffer(int $sourceId, array $adjustments = []): EnergyOffer
    {
        $offer = $this->real()->cloneOffer($sourceId, $adjustments);
        $this->invalidateCache();
        return $offer;
    }

    public function createOfferFromTemplate(string $type, array $data): EnergyOffer
    {
        $offer = $this->real()->createOfferFromTemplate($type, $data);
        $this->invalidateCache();
        return $offer;
    }

    public function getOfferById(int $id): ?EnergyOffer
    {
        return $this->real()->getOfferById($id);
    }

    public function getMetrics(): array
    {
        return $this->real()->getMetrics();
    }

    public function getMarketContext(): array
    {
        return $this->real()->getMarketContext();
    }

    /** Estado de la caché del Proxy, para el panel de patrones. */
    public function getCacheStatus(): array
    {
        return [
            'ttlSeconds' => $this->ttl(),
            'valid' => $this->isCacheValid(),
            'entries' => $this->isCacheValid() ? count($this->cache['offers']) : 0,
            'expiresIn' => $this->isCacheValid() ? max(0, (int) $this->cache['expiresAt'] - time()) : 0,
        ];
    }
}
```

**Política de protección y caché** (valores actuales de `ConfigService`):

| Clave | Valor por defecto | Uso en el Proxy |
|-------|-------------------|-----------------|
| `offersCacheTtl` | `10` segundos | TTL de la caché de ofertas |
| `minPurchaseKwh` | `1` kWh | Mínimo por operación de compra |
| `maxPurchaseKwh` | `100` kWh | Máximo por operación de compra |
| `defaultPricePerKwh` | `500` COP | Precio por defecto del mercado (no lo usa el Proxy, pero contextualiza) |
| `maxOfferKwh` | `1000` kWh | Tope de una oferta (validado en el mercado) |

**Integración con el sistema:**

| Punto de integración | Qué hace |
|----------------------|----------|
| `EnergyController::getAvailableOffers()` | Llama a `$this->marketProxy->getAvailableOffers()` (caché + virtual) |
| `EnergyController::purchaseOffer()` | Llama a `$this->marketProxy->purchaseOffer()` (protección + invalidación) |
| `EnergyController::store()` / `storeExpress()` / `clone()` / `cloneTemplate()` | Pasan por el Proxy para invalidar la caché al mutar |
| `EnergyPlatformFacade` | Usa `MarketProxy` para que las operaciones del panel también mantengan la caché coherente |
| `GET /api/energy/proxy-stats` | Devuelve `getCacheStatus()` + configuración |

**Endpoints del patrón Proxy:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/energy/offers` | Ofertas disponibles; puede servirse desde la caché del Proxy |
| POST | `/api/energy/offers/{id}/purchase` | Compra protegida (1–100 kWh); invalida la caché si es exitosa |
| POST | `/api/energy/offers` | Publica una oferta; invalida la caché |
| POST | `/api/energy/offers/express` | Publica una oferta exprés; invalida la caché |
| POST | `/api/energy/offers/{id}/clone` | Clona una oferta; invalida la caché |
| POST | `/api/energy/offers/clone-template` | Crea desde plantilla; invalida la caché |
| GET | `/api/energy/proxy-stats` | Estado de la caché (`valid`, `entries`, `expiresIn`, `ttlSeconds`) y política |

**Ejemplo de respuesta** (`GET /api/energy/proxy-stats`):

```json
{
  "cache": {
    "ttlSeconds": 10,
    "valid": true,
    "entries": 4,
    "expiresIn": 7
  },
  "config": {
    "marketName": "Plataforma de Comercio de Energia",
    "defaultPricePerKwh": 500,
    "currency": "COP",
    "maxOfferKwh": 1000,
    "minPurchaseKwh": 1,
    "maxPurchaseKwh": 100,
    "offersCacheTtl": 10
  }
}
```

**Prueba funcional (cache hit y bloqueo):**

```bash
B=http://localhost:8000/api/energy

# 1) Primera lectura: cache miss (consulta el mercado y cachea)
curl $B/offers > /dev/null

# 2) Segunda lectura: cache hit (el Proxy no toca MarketService)
curl $B/offers > /dev/null

# 3) Estado: la cache debe estar válida y con entradas
curl $B/proxy-stats

# 4) Compra fuera de política: el Proxy la bloquea antes del sujeto real
curl -X POST $B/offers/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"kwh": 999}'
# → {"success":false,"message":"Proxy de seguridad: no se pueden comprar más de 100 kWh por operación"}

# 5) Compra válida: delega y invalida la cache
curl -X POST $B/offers/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"kwh": 2}'
```

> **Importante:** todas las rutas que modifican el mercado pasan por el Proxy (`EnergyController` y `EnergyPlatformFacade`), de modo que la caché se invalida también al publicar, clonar o comprar desde el panel unificado. Así se evita servir ofertas desactualizadas.

---

## 26. `EnergyApiProxy` — Frontend

**Archivo:** `frontend/src/patterns/proxy/EnergyApiProxy.ts`

**En qué consiste dentro del proyecto:** es el **Proxy del cliente HTTP**. Envuelve a `EnergyApiService` (Singleton) y añade una caché de ofertas con TTL de **10 segundos** y la validación de compras (**1–100 kWh**). Los componentes no llaman directamente al servicio: usan el Proxy, que decide si responde desde su caché o si hace la petición real.

**Cómo funciona:**

1. `getInstance()` devuelve la única instancia del Proxy (Singleton).
2. `getAvailableOffers()` comprueba `offersCache`; si no ha expirado, devuelve los datos cacheados.
3. Si expiró o no existe, llama a `EnergyApiService.getAvailableOffers()` y guarda `{ data, expiresAt }`.
4. `purchaseOffer(id, kwh)` valida el rango 1–100 kWh **antes** de llamar a la API; si la compra es exitosa, invalida la caché de ofertas.
5. `invalidateOffers()` permite forzar la invalidación (lo usa `PatternsPanel`).
6. El resto de métodos delega de forma transparente en `EnergyApiService` (ofertas, predicciones, dispositivos, liquidaciones, extras, paquetes, plataforma, etc.).

**Diagrama UML:**

```
┌─────────────────────────────────────────────────────────────┐
│                        «Client»                             │
│      EnergyDashboard · PatternsPanel · otros paneles        │
└───────────────────────────┬─────────────────────────────────┘
                            │ getAvailableOffers()
                            │ purchaseOffer(id, kwh)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         «Proxy»                             │
│                     EnergyApiProxy                          │
├─────────────────────────────────────────────────────────────┤
│ - api : EnergyApiService  (Singleton)                       │
│ - offersCache : { data, expiresAt } | null                  │
├─────────────────────────────────────────────────────────────┤
│ + getAvailableOffers() : Promise<EnergyOffer[]>             │
│ + purchaseOffer(id, kwh) : Promise<...>                     │
│ + invalidateOffers()                                        │
│ + delegaciones transparentes...                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ delega si no hay caché
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    «RealSubject»                            │
│                  EnergyApiService                           │
│                  (Singleton HTTP)                           │
├─────────────────────────────────────────────────────────────┤
│ GET  /api/energy/offers                                     │
│ POST /api/energy/offers/{id}/purchase                       │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Código completo** (`EnergyApiProxy.ts`):

```typescript
import EnergyApiService, { type EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron Proxy (frontend).
 *
 * Envoltorio del cliente HTTP (Singleton) que añade:
 * - Caché de ofertas disponibles con TTL (virtual/proxy de caché).
 * - Validación de compras (proxy de protección).
 */
class EnergyApiProxy {
  private static instance: EnergyApiProxy;
  private api = EnergyApiService.getInstance();

  private offersCache: { data: EnergyOffer[]; expiresAt: number } | null = null;

  private constructor() {}

  static getInstance(): EnergyApiProxy {
    if (!EnergyApiProxy.instance) {
      EnergyApiProxy.instance = new EnergyApiProxy();
    }
    return EnergyApiProxy.instance;
  }

  private ttlMs(): number {
    return 10_000;
  }

  invalidateOffers() {
    this.offersCache = null;
  }

  async getAvailableOffers(): Promise<EnergyOffer[]> {
    const now = Date.now();
    if (this.offersCache && now < this.offersCache.expiresAt) {
      return this.offersCache.data;
    }
    const data = await this.api.getAvailableOffers();
    this.offersCache = { data, expiresAt: now + this.ttlMs() };
    return data;
  }

  async purchaseOffer(id: number, kwh: number) {
    if (kwh < 1) {
      return { success: false, message: 'Proxy: la compra mínima es 1 kWh' };
    }
    if (kwh > 100) {
      return { success: false, message: 'Proxy: no se pueden comprar más de 100 kWh por operación' };
    }
    const result = await this.api.purchaseOffer(id, kwh);
    if (result.success) {
      this.invalidateOffers();
    }
    return result;
  }

  // Delegaciones transparentes (resto de métodos)
  createOffer(offer: EnergyOffer) {
    return this.api.createOffer(offer);
  }

  createExpressOffer(data: { producerName: string; totalKwh: number; energyType: string }) {
    return this.api.createExpressOffer(data);
  }

  cloneOffer(id: number, adjustments?: Partial<EnergyOffer>) {
    return this.api.cloneOffer(id, adjustments);
  }

  getPrototypeTemplates() {
    return this.api.getPrototypeTemplates();
  }

  createOfferFromTemplate(data: { energyType: string; producerName: string; totalKwh: number; pricePerKwh?: number }) {
    return this.api.createOfferFromTemplate(data);
  }

  getMetrics() {
    return this.api.getMetrics();
  }

  getSourceCatalog() {
    return this.api.getSourceCatalog();
  }

  getPredictions(production = 0, consumption = 0) {
    return this.api.getPredictions(production, consumption);
  }

  getDevices() {
    return this.api.getDevices();
  }

  getDeviceTelemetry<T = unknown>(deviceId: string) {
    return this.api.getDeviceTelemetry<T>(deviceId);
  }

  getTelemetrySummary() {
    return this.api.getTelemetrySummary();
  }

  getSettlementMatrix() {
    return this.api.getSettlementMatrix();
  }

  quoteSettlement(data: { profile: string; currency: string; kwh: number; pricePerKwh: number }) {
    return this.api.quoteSettlement(data);
  }

  getExtrasCatalog() {
    return this.api.getExtrasCatalog();
  }

  quoteWithExtras(data: { kwh: number; pricePerKwh: number; extras: string[] }) {
    return this.api.quoteWithExtras(data);
  }

  getSampleBundle() {
    return this.api.getSampleBundle();
  }

  evaluateBundle(tree: unknown) {
    return this.api.evaluateBundle(tree);
  }

  getPlatformDashboard() {
    return this.api.getPlatformDashboard();
  }

  publishSurplus(data: { producerName: string; totalKwh: number; pricePerKwh: number; energyType?: string; description?: string }) {
    return this.api.publishSurplus(data);
  }

  buyEnergy(offerId: number, kwh: number, profile = 'residential', currency = 'COP') {
    return this.api.buyEnergy(offerId, kwh, profile, currency);
  }

  getSurplusAdvice(production = 0, consumption = 0) {
    return this.api.getSurplusAdvice(production, consumption);
  }

  getIoTNetworkStatus() {
    return this.api.getIoTNetworkStatus();
  }

  getFlyweightStats() {
    return this.api.getFlyweightStats();
  }

  getProxyStats() {
    return this.api.getProxyStats();
  }
}

const energyApiProxy = EnergyApiProxy.getInstance();
export default energyApiProxy;
export { EnergyApiProxy };
```

**Integración con el sistema:**

| Punto de integración | Qué hace |
|----------------------|----------|
| `EnergyDashboard.tsx` | Obtiene las ofertas con `energyApiProxy.getAvailableOffers()` y compra con `purchaseOffer()` |
| `PatternsPanel.tsx` | Consulta `getProxyStats()` y `getFlyweightStats()`, y permite `invalidateOffers()` |
| `EnergyApiService` | Sigue siendo el cliente HTTP Singleton; el Proxy lo envuelve y delega |
| `EnergyApiProxy` | Expone también `getPlatformDashboard()`, `buyEnergy()`, etc., para el resto de paneles |

```tsx
// EnergyDashboard.tsx — el componente usa el Proxy, no el servicio directo
const api = energyApiProxy;

const data = await api.getAvailableOffers();       // cache hit o petición real
const result = await api.purchaseOffer(id, kwh);   // validación 1–100 kWh
```

```tsx
// PatternsPanel.tsx — estado del Proxy + invalidación manual
const [p, f] = await Promise.all([
  api.getProxyStats(),
  api.getFlyweightStats(),
]);

// Forzar que la próxima lectura vaya al backend
api.invalidateOffers();
```

**Comparativa del Proxy en backend y frontend:**

| Aspecto | Backend (`MarketProxy`) | Frontend (`EnergyApiProxy`) |
|---------|-------------------------|-----------------------------|
| Sujeto real | `MarketService` (Singleton) | `EnergyApiService` (Singleton) |
| Virtual | Sí: `real()` crea el servicio al primer acceso | No: el cliente Singleton se obtiene al construir el Proxy |
| Caché | Archivo `market_proxy_cache.json` + TTL configurable | Memoria (`offersCache`) + TTL 10 s |
| Protección | `ConfigService` (1–100 kWh) | Validación local (1–100 kWh) |
| Invalidación | En cada mutación del mercado | Tras una compra exitosa o `invalidateOffers()` |
| Métricas | `getCacheStatus()` en `/proxy-stats` | `getProxyStats()` delega en el backend |

> **Nota:** el TTL del backend se lee de `ConfigService` (`offersCacheTtl`), por lo que puede cambiarse sin tocar el Proxy; el del frontend está fijado en `ttlMs()` (10 000 ms) para mantener la coherencia con la caché del backend.

---

## Integración de Flyweight y Proxy en la interfaz

El componente **`PatternsPanel`** es el cliente visual de ambos patrones. Al montarse consulta, en paralelo, las métricas del backend y del frontend:

- **Flyweight:** muestra los tres descriptores compartidos (`list()`), las instancias creadas, el total de usos y los usos por tipo.
- **Proxy:** muestra si la caché es válida, cuántas entradas tiene, el TTL, el tiempo restante y la política de compras (mínimo/máximo). También permite **forzar la invalidación** de la caché del frontend.

**Archivo:** `frontend/src/components/PatternsPanel.tsx`

```tsx
const api = energyApiProxy;
const fly = energyTypeFlyweightFactory;

const [p, f] = await Promise.all([
  api.getProxyStats(),        // Proxy: caché + política (backend)
  api.getFlyweightStats(),    // Flyweight: pool compartido (backend)
]);

// Flyweight del frontend: los 3 descriptores compartidos
fly.list().map((d) => `${d.emoji} ${d.type}`).join(' · ');

// Proxy del frontend: invalidación manual de la caché
api.invalidateOffers();
```

**Endpoints que alimentan el panel:**

| Método | Ruta | Patrón | Qué devuelve |
|--------|------|--------|--------------|
| GET | `/api/energy/flyweight-stats` | Flyweight | Instancias compartidas, usos, ahorro y descriptores |
| GET | `/api/energy/proxy-stats` | Proxy | Estado de la caché y política de compras |
| GET | `/api/energy/offers` | Flyweight + Proxy | Ofertas cacheadas y enriquecidas con `energySource` |

**Demostración rápida:**

1. Abrir el panel **Flyweight y Proxy** en la interfaz.
2. Pulsar **Actualizar** dos veces: la segunda lectura puede venir de la caché (dependiendo del TTL).
3. Ver el cambio de **Caché válida: Sí/No**, las entradas y el tiempo restante.
4. Intentar comprar **999 kWh** desde el dashboard: el Proxy responde con el mensaje de bloqueo.
5. Publicar o clonar una oferta: la caché se invalida y la siguiente lectura refleja el cambio.
6. En Flyweight, comparar **instancias creadas (3)** con el **total de usos** y el campo `savedInstances`.

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
| POST | `/api/energy/offers/{id}/clone` | Duplicar una oferta existente (Prototype — clon del backend) |
| POST | `/api/energy/offers/clone-template` | Crear una oferta clonando una plantilla del `PrototypeRegistry` |
| GET | `/api/energy/offers` | Consultar ofertas disponibles |
| POST | `/api/energy/offers/{id}/purchase` | Comprar energía de una oferta |
| GET | `/api/energy/metrics` | Ver métricas del mercado |
| GET | `/api/energy/source-catalog` | Ver catálogo de fuentes de energía (Factory Method) |
| GET | `/api/energy/prototype-templates` | Ver las plantillas de oferta (Prototype — `PrototypeRegistry`) |
| GET | `/api/energy/predictions` | Ver predicciones de producción/consumo (Abstract Method) ligadas al estado real del mercado. Acepta `?production=&consumption=` |
| GET | `/api/energy/legacy/meters` | Ver los registros crudos del medidor SCADA legado (Adapter — datos sin adaptar) |
| GET | `/api/energy/legacy/inverters` | Ver los payloads crudos del inversor fotovoltaico (Adapter — JSON en texto) |
| GET | `/api/energy/devices` | Ver el inventario IoT ya normalizado a `DeviceGateway` (Adapter) |
| GET | `/api/energy/devices/{deviceId}/telemetry` | Ver la telemetría de un dispositivo traducida a `DeviceTelemetry` (Adapter) |
| GET | `/api/energy/devices/telemetry/summary` | Ver el consolidado de la red IoT: en línea, kW totales y reparto por fabricante (Adapter) |
| GET | `/api/energy/settlements/matrix` | Ver la matriz de liquidaciones: perfiles × monedas (Bridge) |
| POST | `/api/energy/settlements/quote` | Emitir una liquidación uniendo `EnergyBill` + `CurrencyBridge` (Bridge) |
| GET | `/api/energy/extras` | Ver el catálogo de extras envolventes (Decorator) |
| POST | `/api/energy/offers/quote-extras` | Cotizar una oferta envolviendo `BasicOffer` con decoradores (Decorator) |
| GET | `/api/energy/bundles/sample` | Ver el árbol de paquetes de ejemplo con totales recursivos (Composite) |
| POST | `/api/energy/bundles/evaluate` | Evaluar un árbol JSON de paquetes/ofertas (Composite) |
| GET | `/api/energy/platform/dashboard` | Panel unificado: mercado + ofertas + red IoT + configuración + actividad en una sola llamada (Facade) |
| POST | `/api/energy/platform/publish-surplus` | Publicar un excedente: lo construye, registra y contabiliza (Facade) |
| POST | `/api/energy/platform/buy` | Comprar energía y emitir su liquidación en la misma operación (Facade) |
| GET | `/api/energy/platform/advice` | Asesoría de excedente: predicciones + mercado + recomendación (Facade). Acepta `?production=&consumption=` |
| GET | `/api/energy/platform/iot-status` | Estado de la red IoT: resumen + inventario normalizado (Facade) |
| GET | `/api/energy/flyweight-stats` | Estadísticas del pool Flyweight (PHP): instancias creadas vs usos |
| GET | `/api/energy/proxy-stats` | Estadísticas del Proxy (PHP): caché válida, TTL, entradas y política de compras |

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

# Duplicar una oferta existente (Prototype — clon del backend. totalKwh/pricePerKwh opcionales)
curl -X POST http://localhost:8000/api/energy/offers/1/clone \
  -H "Content-Type: application/json" \
  -d '{"totalKwh": 10}'

# Consultar las plantillas del PrototypeRegistry
curl http://localhost:8000/api/energy/prototype-templates

# Crear una oferta clonando una plantilla (Prototype — clon del backend)
curl -X POST http://localhost:8000/api/energy/offers/clone-template \
  -H "Content-Type: application/json" \
  -d '{"energyType": "wind", "producerName": "Maria Lopez", "totalKwh": 8, "pricePerKwh": 700}'

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

# Ver los datos CRUDOS del medidor SCADA (Adapter — el "antes" de adaptar)
curl http://localhost:8000/api/energy/legacy/meters

# Ver los datos CRUDOS del inversor fotovoltaico (Adapter — payload JSON en texto)
curl http://localhost:8000/api/energy/legacy/inverters

# Ver el inventario IoT ya normalizado (Adapter — el cliente solo ve DeviceGateway)
curl http://localhost:8000/api/energy/devices

# Ver la telemetría de un dispositivo ya traducida (Adapter)
curl http://localhost:8000/api/energy/devices/scada-itm-4417/telemetry

# Ver la telemetría del inversor (mismo modelo, otro fabricante)
curl http://localhost:8000/api/energy/devices/inverter-inv-77021/telemetry

# Consolidado de la red IoT (Adapter)
curl http://localhost:8000/api/energy/devices/telemetry/summary

# Matriz de liquidaciones: 2 perfiles x 3 monedas (Bridge)
curl http://localhost:8000/api/energy/settlements/matrix

# Emitir liquidación residencial en COP (Bridge — EnergyBill + CopCurrency)
curl -X POST http://localhost:8000/api/energy/settlements/quote \
  -H "Content-Type: application/json" \
  -d '{"profile": "residential", "currency": "COP", "kwh": 50, "pricePerKwh": 500}'

# La MISMA factura residencial, solo cambia el implementor (Bridge)
curl -X POST http://localhost:8000/api/energy/settlements/quote \
  -H "Content-Type: application/json" \
  -d '{"profile": "residential", "currency": "USD", "kwh": 50, "pricePerKwh": 10}'

# Perfil comercial en EUR: el recargo y la tarifa fija de US$ 25 se adaptan solos
curl -X POST http://localhost:8000/api/energy/settlements/quote \
  -H "Content-Type: application/json" \
  -d '{"profile": "commercial", "currency": "EUR", "kwh": 50, "pricePerKwh": 10}'

# Cotizar una oferta envuelta con decoradores (Decorator)
curl -X POST http://localhost:8000/api/energy/offers/quote-extras \
  -H "Content-Type: application/json" \
  -d '{"kwh": 20, "pricePerKwh": 500, "extras": ["green", "priority"]}'

# Arbol de paquetes de ejemplo con totales recursivos (Composite)
curl http://localhost:8000/api/energy/bundles/sample

# Evaluar un arbol JSON propio (Composite)
curl -X POST http://localhost:8000/api/energy/bundles/evaluate \
  -H "Content-Type: application/json" \
  -d '{"type": "bundle", "name": "Mi paquete", "children": [{"type": "offer", "name": "Solar techo", "kwh": 10, "pricePerKwh": 500}, {"type": "offer", "name": "Eolica finca", "kwh": 8, "pricePerKwh": 450}]}'

# Panel unificado de la plataforma (Facade: mercado + ofertas + IoT +
# configuracion + actividad en UNA sola llamada)
curl http://localhost:8000/api/energy/platform/dashboard

# Publicar un excedente (Facade: Builder + registro + conteo + log)
curl -X POST http://localhost:8000/api/energy/platform/publish-surplus \
  -H "Content-Type: application/json" \
  -d '{"producerName": "Juan Perez", "totalKwh": 15, "pricePerKwh": 500, "energyType": "solar", "description": "Excedente de paneles solares"}'

# Comprar energia Y recibir su liquidacion (Facade: compra + Bridge)
curl -X POST http://localhost:8000/api/energy/platform/buy \
  -H "Content-Type: application/json" \
  -d '{"offerId": 1, "kwh": 5, "profile": "residential", "currency": "COP"}'

# Asesoria de excedente (Facade: prediccion + mercado + recomendacion)
curl "http://localhost:8000/api/energy/platform/advice?production=30&consumption=50"

# Estado de la red IoT (Facade: Adapter normalizado + resumen)
curl http://localhost:8000/api/energy/platform/iot-status

# Estadisticas de Flyweight (pool compartido de descriptores)
curl http://localhost:8000/api/energy/flyweight-stats

# Estadisticas de Proxy (cache + proteccion de compras)
curl http://localhost:8000/api/energy/proxy-stats
```

## Patrones de diseño implementados

Hasta el momento se han implementado y documentado en este README los siguientes patrones:

| # | Patrón | Implementaciones |
|---|--------|------------------|
| 1 | **Singleton** | `MarketService`, `LoggerService`, `ConfigService`, `EnergyApiService` |
| 2 | **Factory Method** | `EnergySourceFactory`, `EnergyCardFactory`, `PredictorFactory` |
| 3 | **Abstract Method / Template Method** | `AbstractPredictor` + `DailyPredictor`/`WeeklyPredictor` (PHP), `Predictor` + variantes (TS) |
| 4 | **Builder** | `EnergyOfferBuilder` + `OfferDirector` (PHP y TS) |
| 5 | **Prototype** | `Prototype`, `OfferPrototype`, `PrototypeRegistry` (PHP y TS) |
| 6 | **Adapter** | `DeviceGateway` + `DeviceMonitorService` con `LegacyScadaAdapter` / `PvInverterAdapter` (PHP y TS) |
| 7 | **Bridge** | `EnergyBill` (`ResidentialBill` / `CommercialBill`) + `CurrencyBridge` (`CopCurrency` / `UsdCurrency` / `EurCurrency`) (PHP y TS) |
| 8 | **Decorator** | `BasicOffer` + `GreenCertificationDecorator` / `InsuranceDecorator` / `PriorityDeliveryDecorator` + `OfferPricingService` (PHP y TS) |
| 9 | **Composite** | `EnergyBundle` (compuesto) + `OfferLeaf` (hoja) + `BundleService` (PHP y TS) |
| 10 | **Facade** | `EnergyPlatformFacade` (PHP) + `PlatformFacade` (TS) delegando en `EnergyApiService` |
| 11 | **Flyweight** | `EnergySourceFlyweightFactory` (PHP) + `EnergyTypeFlyweightFactory` (TS) |
| 12 | **Proxy** | `MarketProxy` (PHP: virtual, caché, protección) + `EnergyApiProxy` (TS: caché TTL + protección) |

*Próximamente se implementará el siguiente patrón de diseño...*
