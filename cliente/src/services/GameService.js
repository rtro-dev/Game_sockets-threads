import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
import { Player, Directions } from "../entities/Player.js";
//se importa ConnectionHandler para poder enviar las actualizaciones de movimiento
import { ConnectionHandler } from "./ConnectionHandler.js";

export class GameService {
    #states = {
        WAITING : 0,
        PLAYING : 1,
        ENDED : 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;
    //para el jugfador actual
    #player = null;

    #actionsList = {
        "NEW_PLAYER" : this.do_newPlayer.bind(this),
        "BOARD" : this.do_newBoard.bind(this)
    };

    constructor(ui){
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async ()=>{
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type] (action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do (data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer (payload) {
        console.log("ha llegado un jugador nuevo");
    };

    async do_newBoard(payload) {
        this.#board.build(payload);
        this.#ui.drawBoard(this.#board.map);
        // se asigna al jugador una de las posiciones de inicio 1, 2, 3 o 4
        const playerNumber = Math.floor(Math.random() * 4) + 1;
        const newPlayer = { ...Player };
        // se recorre el tablero para encontrar la posición del jugador
        for (let i = 0; i < this.#board.map.length; i++) {
            for (let j = 0; j < this.#board.map[i].length; j++) {
                if (this.#board.map[i][j] === playerNumber) {
                    newPlayer.x = i;
                    newPlayer.y = j;
                    newPlayer.status = playerNumber;
                    break;
                }
            }
        }
        this.#players.push(newPlayer);
        this.#player = newPlayer;
        this.#ui.drawBoard(this.#board.map, this.#player);
    }

    //obtener el jugador actual
    get player() {
        return this.#player;
    }

    //métodos para controlar al jugador
    rotatePlayer(player) {
        // se guarda la dirección tras rotar pulsando el botón
        if (player.direction == 3) {
            player.direction = 0;
        } else {
            player.direction = player.direction + 1;
            /* player.style.transform = "rotate(90deg)"; */
        }
        // envía la posición actualizada
        ConnectionHandler.gameUpdate(this.#players);
        // actualiza el tablero
        this.#ui.drawBoard(this.#board.map, player);
    };

    movePlayer(player) {
        //se guarda la posición antes del movimiento
        let posX = Number(player.x);
        let posY = Number(player.y);
        //se crean las nuevas coordenadas partiendo de las antiguas
        let newX = posX;
        let newY = posY;

        switch (player.direction) {    //se recuperaría la dirección y se haría el switch con eso
            case Directions.Up:
                newY = Number(player.y) - 1;
                if (newY >= 0) {
                    player.y = newY;
                }
            break;
            case Directions.Right: 
            newX = Number(player.x) + 1;
                if (newX < this.#board.map.length) {
                    player.x = newX; 
                }
                break;
            case Directions.Down:
                newY = Number(player.y) + 1; 
                if (newY < this.#board.map.length) {
                    player.y = newY;
                }
                break;
            case Directions.Left:
                newX = Number(player.x) - 1;
                if (newX >= 0) {
                    player.x = newX;
                }
                break;
        }
        //se pone al jugador en la nueva posición
        this.#board.map[player.y][player.x] = player.status;
        //se borra la posición anterior
        this.#board.map[posY][posX] = 0;
        // envía la posición actualizada
        ConnectionHandler.gameUpdate(this.#players);
        //se redibuja el tablero
        this.#ui.drawBoard(this.#board.map, player);
    }

    hitPlayer(player) {
        if (player.state == PlayerStates.Hit) {
            if ((Math.abs(Number(player.x) - Number(otherPlayer.x)) + Math.abs(Number(player.y) - Number(otherPlayer.y))) == 1){  
                otherPlayer.state = PlayerStates.Dead;
            }
        }
    }
    
}