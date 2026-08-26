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
