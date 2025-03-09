import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { GameService } from './GameService';
import { AnyTxtRecord } from 'dns';
import { Player } from '../entities/Player';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active : boolean;
    static messages = {
        out: {
            new_player: "NEW_PLAYER"
        } 
    }

    public inputMessage = [
            {
                type: "HELLO",
                do: this.doHello
            },
            {
                type: "BYE",
                do: this.doBye
            },
            //se añade la actualización de posiciones
            {
                type: "POSITION_UPDATE",
                do: this.doPositionUpdate
            }
        ];

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", { status: true });
            GameService.getInstance().addPlayer(GameService.getInstance().buildPlayer(socket));
            
            socket.on("message", (data)=>{
                const doType = this.inputMessage.find(item => item.type == data.type);
                if (doType !== undefined) {
                    doType.do(data);
                }
            })

            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });
        });
    }

    public addPlayerToRoom(player : Socket, room: String) {
        player.join(room.toString());
    }

    public sendMessage(room: String |null ,type: String, content: any) {
        console.log(content);
        if (this.active && this.io!=null) {
            if (room != null) {
                    this.io?.to(room.toString()).emit("message", {
                        type, content
                    })
            }
        }
    }

    public gameStartMessage() {
        //
    }

    public isActive() {
        return this.active;
    }

    private doHello(data: String) {
        console.log("Hola");
        console.log(data);
    }

    private doBye(data: String) {
        console.log("Adios");
        console.log(data);
    }

    //se actualizan las posiciones iterando sobre cada jugador guardado en players[]
    //socket.io no permite enviar players[], por lo que se envía un objeto con las posiciones de cada jugador y dentro se utiliza players[]
    private doPositionUpdate(data: any) {
        const players = data.players;
        let posX : Number = 0;
        let posY : Number = 0;
        let playerDirection : Number = 0;
        players.forEach((player: Player) => {
            posX = player.x;
            posY = player.y;
            playerDirection = player.direction;
        });
        //se actualizan las x, y y dirección de cada jugador guardado en players[] dentro de la room
        this.room.players.forEach((element) => {
            if (element.type == 1) {
                element.x = posX;
                element.y = posY;
                element.direction = playerDirection;
            }
        })
    }
}