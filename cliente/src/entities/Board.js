export const ELEMENTS = {
    bush : 5,
    player1 : 1,
    player2 : 2,
    player3 : 3,
    player4 : 4
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
            switch(element) {
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
                case 5:
                    this.#map[element.x][element.y] = ELEMENTS.bush;
                    break;
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

/* {
    x: 0;
    y: 0;
    tipe: empty;
    obj: null;
} */