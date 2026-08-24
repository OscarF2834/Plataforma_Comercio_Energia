# Plataforma_Comercio_Energia

Planteamiento de lo que se va a realizar en el proyecto

Primero lo que debemos saber, es que se trata de una plataforma de comercio y energía. Esta plataforma permite que los usuarios que producen energía puedan vender o suministrar a otras personas que necesiten consumir energía. Entonces, el sistema lo que busca es poder ofrecer o intercambiar energía entre usuarios mediante una plataforma centralizada en la que se puede consultar la energía disponible, publicación de ofertas, realizar las compras y por supuesto la consulta de información con respecto a la producción y consumo energético.

Cabe resaltar que este es un proyecto que planea ser solamente un prototipo funcional y que no planea tener una conexión directa con redes eléctricas, ni involucrar procesos reales de facturación y distribución de energía. Las transacciones se harán de forma virtual desde la misma plataforma. Teniendo en cuenta todo lo anterior, se podría construir un objetivo primordial el cual resume todo lo que se desea hacer en este software que se realizará a lo largo del semestre.

# Objetivo Principal

●	Desarrollar una plataforma que permita gestionar el intercambio de excedentes de energía entre los mismos usuarios, apoyándose en información como lo son: Predicciones básicas de consumo y de producción.

Usuarios principales que interactúan con la plataforma.

En el sistema como lo hablamos anteriormente, se basará principalmente en dónde tipos de usuario y son los siguientes:

●	Productor: Es el usuario que genera energía y puede tener excedentes disponibles para vender 
●	Consumidor: Es el usuario que necesita adquirir la energía que tienen otros usuarios.

Un usuario podría desempeñar el rol de productor y de consumidor,  puede producir energía mediante paneles solares y también consumir energía y comprarla cuando su producción no sea suficiente.

Vamos ahora a definir los subsistemas que estaremos utilizando a lo largo de la realización del proyecto y son los siguientes:

# 1.	Subsistema de compra y venta de excedentes energéticos
Este sistema básicamente trata de realizar el intercambio de energía entre los usuarios. La función principal de este subsistema es poder consultar ese excedente de energía disponible y poder adquirirlo. Ahora, las principales funcionalidades que tiene este apartado serían las siguientes:

●	Registrar un excedente de energía
●	indicar la cantidad disponible de energía, medida en kWh
●	Establecer un precio concreto por kWh
●	consultar los excedentes disponibles
●	filtrar esos excedentes disponibles 
●	la compra de un excedente
●	Registrar esa transacción realizada
●	y consultar el historial de compras y de las ventas.

 Un ejemplo de cómo funciona el sistema, sería de la siguiente manera:
Un usuario posee paneles solares y durante determinado período produce 15 kWh, pero solamente consume 10 kWh.
Por lo tanto, dispone de:

15 kWh - 10 kWh = 5 kWh de excedente.  “CLAVE DEL SISTEMA”.
El usuario puede publicar esos 5 kWh en la plataforma indicando un precio determinado.Otro usuario que necesita energía puede consultar la oferta y realizar la compra. La plataforma registra la operación y actualiza la cantidad de energía disponible. Ahora, el alcance principal de este sistema, sería la forma en cómo sería el sistema sin llegar a sobrepasar las funcionalidades.

Para evitar que el proyecto sea demasiado grande, inicialmente no sería necesario realizar:
●	Pagos bancarios reales.
●	Conexión con empresas de energía.
●	Distribución física de electricidad.
●	Facturación real.
●	Medición oficial de energía.
Las compras pueden manejarse mediante un saldo o sistema de transacciones virtuales.

# 2.	Subsistema de subastas en tiempo real. 
Este subsistema permite realizar subastas sobre determinados excedentes energéticos, En lugar de que el productor establezca directamente un comprador, pública una cantidad de energía y establece las condiciones de la subasta.Los consumidores interesados pueden realizar ofertas durante un período determinado.
Funcionamiento básico
Por ejemplo:
Un productor dispone de:
10 kWh
y establece una subasta con un precio inicial de:
$500 por kWh.

Los consumidores pueden realizar ofertas:
●	Usuario A: $500/kWh
●	Usuario B: $550/kWh
●	Usuario C: $600/kWh

Cuando finaliza el tiempo establecido para la subasta, el sistema determina la oferta ganadora y registra la transacción. La principales funcionalidades que tendría serian las siguientes
●	Crear una subasta.
●	Definir la cantidad de energía disponible.
●	Establecer precio inicial.
●	Establecer fecha y hora de inicio.
●	Establecer fecha y hora de finalización.
●	Consultar subastas activas.
●	Realizar ofertas.
●	Consultar la oferta más alta.
●	Finalizar automáticamente la subasta.
●	Registrar al ganador.

Alcance
Para mantener el proyecto realizable, el concepto de "tiempo real" puede implementarse únicamente dentro de la plataforma.
Por ejemplo, mediante una actualización periódica de las ofertas o mediante tecnologías como WebSocket si el equipo tiene tiempo suficiente. No es necesario construir un sistema de subastas comparable con plataformas comerciales de gran escala.

# 3.	Subsistema de Integración con dispositivos IoT domésticos
Este subsistema permite conectar virtualmente los dispositivos domésticos (como   medidores inteligentes o inversores) para automatizar la lectura de generación y del consumo de la energía de la plataforma
Funcionamiento básico
por ejemplo: 

Un medidor inteligente mostró que un panel solar produjo 8 kWh a las 2:00 PM  y que la casa consumió 5 kWh. El dispositivo envía estos datos al sistema y actualiza en tiempo real el saldo de excedente a 3 kWh sin necesidad de que el usuario lo ingrese de manera manual.

Funciones principales
●	Registrar y vincular un dispositivo IoT. 
●	Simular la recepción de lecturas periódicas de generación y consumo.
●	registrar el historial de lecturas por fecha y hora.
●	calcular automáticamente el excedente diario/horario a partir de los datos que se reciben en el sistema.
●	Consultar el estado de la conexión.

 Alcance
Para mantener el prototipo manejable, no se requiere un hardware físico ni protocolos complejos de telecomunicaciones. Las lecturas IoT pueden ser simuladas mediante un script, Una API (JSON) o un formulario de pruebas que envíe datos periódicamente al sistema.

# 4.	Subsistema de predicción de producción y consumo 
Este subsistema ofrece estimaciones a los usuarios sobre cuánta energía producirán o consumen en periodos futuros, ayudándoles a planificar la compra y venta anticipada de excedentes.
Funcionamiento básico

Por ejemplo:

El sistema analiza el promedio histórico de los usuarios los fines de semana y el pronóstico de radiación solar (esta puede ser generada por un script). Le muestre una estimación: “Mañana se espera producir 18 kWh y consumir 10 kWh, tendrás 8 kWh disponibles para ofertar”.
Funcionalidades principales 

●	Consultar gráficos o indicadores de predicción diaria/semanal.
●	Generar estimaciones simples de producción.
●	Generar estimaciones simples de consumo de hogar.
●	Mostrar recomendaciones al usuario sobre el mejor momento para vender o comprar energía.

 Alcance
No es necesario implementar modelos complejos de IA o Machine Learning avanzado. La predicción se puede desarrollar utilizando promedios ponderados, regresiones lineales simples o datos de prueba precalculados almacenados en la base de datos.
