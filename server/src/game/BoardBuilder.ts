import { Board } from "./entities/Board";
import { Element } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            size: 10,
            elements: []
        }
        const rows = this.board.size;
        const cols = this.board.size;
        // const map es de tipo Array de Arrays de la interfaz Element de Board.ts, por lo que cada posición contiene x, y, type y obj (antes hay que importar Element)
        // de esta forma se guardan objetos dentro de las casillas del Array
        // Formas de escribir un Array en typescript:
            // Array<Array<tipo>> = []
            // o
            // tipo[][] = []
        const map: Array<Array<Element>> = [];
            for (let i = 0; i < rows; i++) {
                map[i] = [];
                for (let j = 0; j < cols; j++) {
                    map[i][j] = {
                        x: 0,
                        y: 0,
                        type: 0,
                        obj: null,
                    }
                }
            }

        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j].type != 0) {
                    this.board.elements.push({x : i, y : j})
                }
    }

    public getBoard() : Board {
        return this.board;
    }
}