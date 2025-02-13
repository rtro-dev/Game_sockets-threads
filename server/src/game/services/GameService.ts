import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../entities/Player";
import { Room } from "../entities/Room";
import { RoomService } from "./RoomService";
import { Game, GameStates, Messages } from "../entities/Game";
import { BoardBuilder } from "../BoardBuilder";
import { ServerService } from "../services/ServerService";
export class GameService {
    private games: Game[];

    private static instance: GameService;
    private constructor() {
        this.games = [];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            type: "player",
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        }
    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);
        //ServerService.getInstance().sendMessage(room.name,ServerService.messages.out.new_player,"new player");
        ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, "new player");
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (room.players.length == 1) {
            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: new BoardBuilder().getBoard()
            }
            room.game = game;
            this.games.push(game);
        }

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                }
            }
            return true;
        }

        return false;
    }

    /* //rotación del jugador
    public rotatePlayer(player: Player, direction: Directions) {
        // se crea una variable para guardar el sentido de movimiento tras rotar pulsando el botón
        let rotateDirection = player.direction;

    }

    public movePlayer(player: Player, direction: Directions) {
        if (player.state == PlayerStates.Moving) {
            return;
        }

        player.state = PlayerStates.Moving;
        player.direction = direction;

        //se guarda la posición actual
        let posX = Number(player.x);    //valor numérico de x
        let posY = Number(player.y);

        switch (direction) {    //se recuperaría la variable de rotavión y se haría el switch con eso
            case Directions.Up:
                posY = Number(player.y) - 1;
                if (posY >= 0) {
                    player.y = posY;
                }
                break;
            case Directions.Down:
                posY = Number(player.y) + 1;
                if (posY < 10) {
                    player.y = posY;
                }
                break;
            case Directions.Left:
                posX = Number(player.x) - 1;
                if (posX >= 0) {
                    player.x = posX;
                }
                break;
            case Directions.Right:
                posX = Number(player.x) + 1;
                if (posX < 10) {
                    player.x = posX;
                }
                break;
        }

        player.state = PlayerStates.Idle;
    }

    public hitPlayer(player: Player) {
        if (player.state == PlayerStates.Hit) {
            if ((Math.abs(Number(player.x) - Number(otherPlayer.x)) + Math.abs(Number(player.y) - Number(otherPlayer.y))) == 1){  
                otherPlayer.state = PlayerStates.Dead;
            }
        }
    } */
}
