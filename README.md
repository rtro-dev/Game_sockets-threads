# Juego

## Contenidos


## Iniciación del proyecto

Servidor
- npm install
- npm install socket.io-server
- npm install express
- node install.js

Cliente
- npm install

Levantar Servidor
- `npm run dev` en /server

## Documentación

El proyecto se divide en dos directorios, uno para el servidor y otro para el cliente.

En ambos directorios se sigue una estructura modular en la que se organizan los ficheros según sean entidades o servicios principalmente.

### Servidor

Cada entidad contiene su respectiva interfaz.

Los servicios proveen las funciones que se usarán.

#### RoomService

El Servicio de Gestión de Salas es el encargado de administrar todas las salas de juego de nuestra aplicación. Este servicio funciona como un punto central que organiza dónde se ubican los jugadores y cómo se distribuyen en las diferentes salas.

Este servicio se encarga de varias tareas importantes:
- Mantiene un registro de todas las salas disponibles en el juego.
- Asigna jugadores a salas cuando estos quieren unirse a una partida.
- Crea nuevas salas automáticamente cuando todas las existentes están ocupadas.
- Controla el aforo de cada sala, asegurándose de que no excedan el número máximo de jugadores permitido.

El servicio está diseñado siguiendo el patrón Singleton, lo que significa que solo existe una única instancia de este servicio en toda la aplicación.

Cuando un jugador quiere unirse a una partida, este servicio busca una sala disponible. Si no encuentra ninguna, crea una nueva sala con un nombre único generado automáticamente. Una vez que una sala alcanza su capacidad máxima, se marca como ocupada para evitar que más jugadores intenten unirse a ella.

#### GameService

Este servicio se encarga de administrar todos los juegos que se están ejecutando en el servidor. Funciona como punto central para crear jugadores, añadirlos a las salas de juego y gestionar el estado de cada partida.

El servicio está diseñado como un "singleton", lo que significa que sólo existe una instancia del mismo en toda la aplicación, permitiendo acceder a los mismos juegos desde cualquier parte del código.

Sus funciones son:
- Mantener un registro de todos los juegos activos.
- Crear nuevos jugadores cuando se conectan al servidor.
- Asignar jugadores a salas y crear nuevos juegos cuando es necesario.
- Gestionar la comunicación a través de mensajes sobre el tablero y nuevos jugadores.
- Iniciar partidas cuando las salas tienen el número adecuado de participantes.

#### ServerService

Este servicio administra las conexiones en tiempo real entre los jugadores y el servidor a través de Socket.IO. Se encarga de gestionar las entradas y salidas de jugadores, actualizar sus posiciones en el mapa del juego, y distribuir mensajes entre los participantes.

El servicio está diseñado como un singleton para garantizar que solo exista una instancia que coordine todas las comunicaciones del juego.

Entre sus funcionalidades principales se incluyen:
- Inicializar la conexión del servidor.
- Gestionar la entrada de nuevos jugadores.
- Procesar mensajes como saludos y despedidas.
- Actualizar la posición de los jugadores en tiempo real.
- Distribuir mensajes a salas específicas de jugadores.

#### BoardBuilder

Esta clase se encarga de construir un tablero de juego para la aplicación.

Al crear una instancia, automáticamente genera un tablero de 10x10 casillas y coloca elementos en él siguiendo ciertas reglas:
- Distribuye arbustos de forma aleatoria por el tablero, asegurándose de que estén separados por al menos una casilla vacía.
- Marca las cuatro esquinas del tablero con un tipo especial (tipo 1).

El tablero generado contiene información sobre cada elemento presente, incluyendo su posición y tipo. Esta estructura puede ser utilizada posteriormente por el juego para representar el estado del tablero.

Para obtener el tablero generado, simplemente llama al método getBoard().

### Cliente

De la misma forma que el servidor, se distribuye en entidades, servicios y en este caso utilidades, que quedan localizadas al mismo nivel que el index.js.

#### Board

Esta entidad representa el tablero de juego. Se encarga de gestionar el mapa y todos los elementos que aparecen en él.

El tablero tiene la capacidad de:
- Construir automáticamente un mapa basado en el tamaño y elementos proporcionados.
- Gestionar diferentes tipos de elementos como jugadores y arbustos.
- Asignar posiciones aleatorias únicas a los jugadores dentro del mapa.
- Mantener un control sobre su estado, para saber si está correctamente construido.

El tablero proporciona el espacio donde los jugadores se pueden mover e interactuar. Una vez construido, cualquier componente del juego puede acceder al mapa para consultar las posiciones de los elementos.

#### Player

Esta entidad representa a cada jugador dentro del juego, permitiendo su interacción.

El jugador cuenta con características como:
- Una posición en el mapa, determinada por coordenadas.
- Un estado que refleja su situación actual en el juego.
- Una dirección hacia la cual está orientado (arriba, derecha, abajo o izquierda).
- Una propiedad de visibilidad que determina si otros pueden verlo.

La dirección en la que mira el jugador es importante para determinar hacia dónde se moverá cuando reciba una instrucción de avance.

#### ConnectionHandler

Este servicio funciona como un puente de comunicación entre el cliente y el servidor del juego. Es responsable de establecer y mantener una conexión en tiempo real para que los jugadores puedan interactuar entre sí durante la partida.

El ConnectionHandler se encarga de:
- Establecer la comunicación inicial con el servidor cuando el juego comienza.
- Mantener informado al jugador sobre el estado de su conexión.
- Transmitir las posiciones actualizadas de los jugadores al servidor.
- Recibir y procesar los mensajes que llegan desde el servidor.
- Notificar cuando la conexión se pierde para que el juego pueda responder adecuadamente.

Este servicio actúa como el mensajero del juego, asegurando que toda la información necesaria fluya correctamente entre el dispositivo del cliente y el servidor donde se desarrolla la partida. Sin él, sería imposible jugar con otros participantes en tiempo real.

#### GameService

Este servicio se encarga de gestionar todos los aspectos del funcionamiento de la partida en el lado del cliente. Actúa como coordinador de los jugadores, el tablero y las propias acciones del juego.

El GameService se ocupa de:
- Mantener el estado actual del juego (esperando, jugando o finalizado).
- Gestionar el tablero donde transcurre la acción de la partida.
- Controlar los movimientos y acciones de los jugadores.
- Procesar las acciones que recibe del servidor mediante un sistema de cola.
- Actualizar la interfaz del juego para reflejar los cambios que ocurren.

Este servicio permite que el jugador pueda moverse por el tablero, rotar para cambiar su dirección y enviar estas actualizaciones a otros jugadores. 

#### GameController

Este componente coordina la comunicación entre la interfaz de usuario y los servicios que hacen funcionar la partida.

El GameController se encarga de:
- Inicializar la interfaz de usuario para que el jugador pueda interactuar con el juego.
- Establecer la conexión con el servidor a través del ConnectionHandler.
- Monitorear constantemente el estado de la conexión para garantizar una experiencia fluida.
- Filtrar las acciones del jugador, permitiendo que estas se ejecuten solo cuando la conexión funciona correctamente.

Cuando la conexión está bien, permite que las acciones del jugador sean procesadas por el GameService; si hay problemas de conexión, evita que estas acciones se realicen, protegiendo así la integridad del juego.

#### Queue

Esta utilidad actúa como una bandeja organizada de mensajes en el juego. Funciona siguiendo el principio de "primero en entrar, primero en salir", similar a una fila de personas esperando su turno.

La Cola (Queue) se encarga de:
- Almacenar mensajes o acciones que deben procesarse en el orden en que fueron recibidos.
- Entregar estos mensajes uno por uno cuando el sistema está listo para manejarlos.
- Mantener un control sobre si hay o no mensajes pendientes por procesar.

Esta herramienta es fundamental para garantizar que todas las acciones del juego se procesen de manera ordenada y secuencial, evitando que se pierda información importante durante momentos de alta actividad. Cuando múltiples eventos ocurren simultáneamente, la Cola asegura que cada uno sea atendido en el momento adecuado.

#### Ui

Este componente es responsable de gestionar la interfaz visual del juego, actuando como un puente entre lo que ocurre en el juego y lo que el jugador puede ver en pantalla.

El Ui se encarga de:
- Inicializar todos los elementos visuales necesarios cuando el juego comienza.
- Dibujar y actualizar el tablero de juego con todos sus componentes.
- Mostrar la posición de cada jugador y otros elementos importantes.
- Refrescar la pantalla cada vez que ocurre un cambio en el estado del juego.

#### UIv1

Esta implementación de la interfaz de usuario proporciona el aspecto visual del juego, presentando el tablero y los controles de forma interactiva.

El UIv1 se encarga de:
- Crear el tablero de juego con un diseño de cuadrícula.
- Mostrar a cada jugador con colores distintivos para facilitar su identificación.
- Indicar claramente qué jugador está activo mediante un borde destacado.
- Presentar la dirección en la que mira cada jugador mediante flechas orientadas.
- Proporcionar controles intuitivos para realizar acciones como rotar, moverse y atacar.

Este componente hace que la experiencia de juego sea más fácil de entender, permitiendo a los jugadores identificar rápidamente su posición, dirección y las acciones que pueden realizar durante su turno.