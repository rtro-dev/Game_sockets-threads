export const ELEMENTS = {
    player1 : 1,
    player2 : 2,
    player3 : 3,
    player4 : 4,
    player_type: 1,
    bush : 5,
    bush_type: 2
};
export class Board {
    #map = null;
    #states = {
        NO_BUILD : 0,
        BUILD : 1
    }
    #state = null;

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }

    build(payload) {
        const { size, elements } = payload;
        this.#map = new Array(size).fill().map(() => new Array(size).fill(0));
        elements.forEach(element=> {
            if (element.type === 2) {
                this.#map[element.x][element.y] = ELEMENTS.bush;
            } else if (element.type === 1) {
                //si no existe, se crea un array para guardar las posiciones usadas
                if (!this.positions) {
                    this.positions = [];
                }
                let playerPosition;
                //se generan las posiciones y se comprueban
                do {
                    playerPosition = Math.floor(Math.random() * 4) + 1;
                } while (this.positions.includes(playerPosition));
                //se añade la posición al array
                this.positions.push(playerPosition);
                
                switch(playerPosition) {
                    case 1:
                        this.#map[element.x][element.y] = ELEMENTS.player1;
                        break;
                    case 2:
                        this.#map[element.x][element.y] = ELEMENTS.player2;
                        break;
                    case 3:
                        this.#map[element.x][element.y] = ELEMENTS.player3;
                        break;
                    case 4:
                        this.#map[element.x][element.y] = ELEMENTS.player4;
                        break;
                }
            }
        });
        this.#state = this.#states.BUILD;
    }

    get map() {
        if (this.#state === this.#states.BUILD) {
            return this.#map;
        } return undefined;
    }
}