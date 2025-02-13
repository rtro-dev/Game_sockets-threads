import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
import { Player } from "../entities/Player.js";

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
    }

    //rotación del jugador
    rotatePlayer(player, direction) {
        // se crea una variable para guardar el sentido de movimiento tras rotar pulsando el botón
        let newDirection = player.direction + 1;
        player.style.transform = "rotate(90deg)";

    }

    movePlayer(player, direction) {
        if (player.state == PlayerStates.Moving) {
            return;
        }

        player.state = PlayerStates.Moving;
        player.direction = direction;

        //se guarda la posición actual
        let posX = Number(player.x);    //valor numérico de x
        let posY = Number(player.y);

        switch (direction) {    //se recuperaría la variable de rotavión y se haría el switch con eso
            case direction.Up:
                posY = Number(player.y) - 1;
                if (posY >= 0) {
                    player.y = posY;
                }
                break;
            case direction.Down:
                posY = Number(player.y) + 1;
                if (posY < 10) {
                    player.y = posY;
                }
                break;
            case direction.Left:
                posX = Number(player.x) - 1;
                if (posX >= 0) {
                    player.x = posX;
                }
                break;
            case direction.Right:
                posX = Number(player.x) + 1;
                if (posX < 10) {
                    player.x = posX;
                }
                break;
        }

        player.state = PlayerStates.Idle;
    }

    hitPlayer(player) {
        if (player.state == PlayerStates.Hit) {
            if ((Math.abs(Number(player.x) - Number(otherPlayer.x)) + Math.abs(Number(player.y) - Number(otherPlayer.y))) == 1){  
                otherPlayer.state = PlayerStates.Dead;
            }
        }
    }
    
}