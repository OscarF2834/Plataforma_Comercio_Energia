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

# Plataforma de Comercio de Energia

Plataforma que permite gestionar el intercambio de excedentes energeticos entre los mismos usuarios, apoyandose en informacion como predicciones basicas de consumo y produccion.

## Descripcion General

Los usuarios principales del sistema son:

- **Productor**: Genera energia mediante paneles solares y puede tener excedentes disponibles para vender.
- **Consumidor**: Necesita adquirir energia de otros usuarios cuando su produccion no es suficiente.

Un usuario puede desempenar ambos roles simultaneamente.

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Laravel + PHP |
| Base de datos | Memoria (in-memory) |
| Patron de diseno | Singleton |

---

## Patron Singleton - Explicacion y Implementacion

### Que es el Singleton?

El Singleton es un patron de diseno que **garantiza que una clase tenga UNA sola instancia** en toda la aplicacion y proporciona un punto de acceso global a ella.

**Analogia sencilla**: Imagina que tu escuela tiene una sola sala de profesores. No importa cuantos profesores haya, todos comparten el **mismo espacio**. Si un profesor deja un papel en el escritorio, otro profesor lo puede encontrar ahi. No existen "dos salas de profesores", solo una.

### Para que sirve?

- **Ahorrar memoria**: No crea objetos repetidos e innecesarios.
- **Compartir datos**: Todos los componentes que usan el singleton trabajan con la **misma informacion**.
- **Control centralizado**: Un solo punto de gestion para un recurso comun.

### Como funciona? (Los 3 pasos clave)

```
1. Constructor PRIVADO    --> Nadie puede hacer "new MiClase()"
2. Atributo ESTATICO     --> Guarda la unica instancia
3. Metodo getInstance()  --> Devuelve siempre la misma instancia
```

```
  Primera llamada                    Segunda llamada
  ──────────────                     ──────────────

  MarketService::getInstance()       MarketService::getInstance()
          │                                   │
          ▼                                   ▼
  ┌─────────────────┐               ┌─────────────────┐
  │ instance == null?│               │ instance != null│
  │    SI (es null)  │               │  (ya existe)    │
  └────────┬────────┘               └────────┬────────┘
           ▼                                 ▼
  ┌─────────────────┐               ┌─────────────────┐
  │ Crea la instancia│              │ Retorna la misma│
  │ y la guarda      │              │ instancia        │
  └────────┬────────┘               └────────┬────────┘
           ▼                                 ▼
      ┌─────────┐                     ┌─────────┐
      │ id: 1   │                     │ id: 1   │
      │ name: X │                     │ name: X │
      └─────────┘                     └─────────┘
         MISMA instancia en ambos casos
```

### Donde se aplica en el proyecto

#### Backend (Laravel) - 3 Servicios

Los servicios singleton estan en `backend-laravel/app/Patterns/`:

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| `MarketService` | `app/Patterns/MarketService.php` | Gestion de ofertas y transacciones |
| `LoggerService` | `app/Patterns/LoggerService.php` | Registro de eventos y metricas |
| `ConfigService` | `app/Patterns/ConfigService.php` | Configuracion centralizada |

**MarketService** (`backend-laravel/app/Patterns/MarketService.php`):
```php
class MarketService
{
    // 2. Atributo estatico que guarda la unica instancia
    private static ?MarketService $instance = null;

    // Datos compartidos por toda la aplicacion
    private array $offers = [];
    private int $transactionCount = 0;

    // 1. Constructor privado - nadie puede hacer "new MarketService()"
    private function __construct() {}

    // 3. Metodo que devuelve SIEMPRE la misma instancia
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function registerOffer(array $data): EnergyOffer { ... }
    public function getAvailableOffers(): array { ... }
}
```

**LoggerService** (`backend-laravel/app/Patterns/LoggerService.php`):
```php
class LoggerService
{
    private static ?LoggerService $instance = null;
    private array $logs = [];

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function log(string $message): void { ... }
}
```

**ConfigService** (`backend-laravel/app/Patterns/ConfigService.php`):
```php
class ConfigService
{
    private static ?ConfigService $instance = null;

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $key): mixed { ... }
}
```

**Uso en el controlador** (`backend-laravel/app/Http/Controllers/EnergyController.php`):
```php
// Todas las llamadas apuntan a la MISMA instancia
$this->market = MarketService::getInstance();
$this->logger = LoggerService::getInstance();
$this->config = ConfigService::getInstance();
```

#### Frontend (React) - 1 Servicio

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| `EnergyApiService` | `frontend/src/patterns/singleton/energy-api.service.ts` | Cliente HTTP centralizado |

**EnergyApiService** (`frontend/src/patterns/singleton/energy-api.service.ts`):
```typescript
class EnergyApiService {
  private static instance: EnergyApiService;
  private baseUrl: string;

  // Constructor privado
  private constructor() {
    this.baseUrl = 'http://localhost:8000/api';
  }

  // getInstance() en TypeScript
  static getInstance(): EnergyApiService {
    if (!EnergyApiService.instance) {
      EnergyApiService.instance = new EnergyApiService();
    }
    return EnergyApiService.instance;
  }

  async getAvailableOffers(): Promise<EnergyOffer[]> { ... }
  async createOffer(offer: EnergyOffer): Promise<EnergyOffer> { ... }
}
```

### Flujo completo en la aplicacion

```
    Frontend (React)                         Backend (Laravel)
    ────────────────                         ─────────────────

    EnergyApiService                         MarketService
    ::getInstance()                          ::getInstance()
           │                                        │
           ▼                                        ▼
    ┌──────────────┐    POST /api/energy/offers  ┌──────────────┐
    │  Un solo     │ ──────────────────────────► │  Un solo     │
    │  objeto      │                             │  objeto      │
    │  HTTP client │ ◄────────────────────────── │  offers[]    │
    └──────────────┘    { ofertas en JSON }      └──────────────┘

    Todos los componentes              Todos los controllers
    usan el MISMO cliente              usan el MISMO servicio
```

---

## Guia de Ejecucion

### Backend (Laravel)

```bash
cd backend-laravel
composer install
php artisan key:generate
php artisan serve --port=8000
```

El backend corre en `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

### Endpoints API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/energy/offers` | Crear una oferta de excedente |
| GET | `/api/energy/offers` | Consultar ofertas disponibles |
| POST | `/api/energy/offers/{id}/purchase` | Comprar energia de una oferta |
| GET | `/api/energy/metrics` | Ver metricas del mercado |

### Ejemplo de Request

```bash
# Crear oferta
curl -X POST http://localhost:8000/api/energy/offers \
  -H "Content-Type: application/json" \
  -d '{
    "producerName": "Juan Perez",
    "totalKwh": 15,
    "pricePerKwh": 500,
    "description": "Excedente de paneles solares"
  }'

# Consultar ofertas
curl http://localhost:8000/api/energy/offers

# Comprar energia
curl -X POST http://localhost:8000/api/energy/offers/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"kwh": 5}'
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
