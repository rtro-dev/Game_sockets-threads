import { Board, Element } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            size: 10,
            elements: []
        }
        const boardSize = this.board.size;

        // se genera un tipo aleatorio entre 0 y 2
        /* const randomType : number = Math.floor(Math.random() * 2); */

        // const map es de tipo Array de Arrays de la interfaz Element de Board.ts, por lo que cada posición contiene x, y, type y obj (antes hay que importar Element)
        // de esta forma se guardan objetos dentro de las casillas del Array
        // Formas de escribir un Array en typescript:
            // Array<Array<tipo>> = []
            // o
            // tipo[][] = []
        const map: Array<Array<Element>> = [];
        for (let i = 0; i < boardSize; i++) {
            map[i] = [];
            for (let j = 0; j < boardSize; j++) {
                map[i][j] = {
                    x: i,
                    y: j,
                    type: 0,
                    obj: null,
                }
            }
        }

        // se generan 5 posiciones para los arbustos y se guardan en un array
        // se comparan las posiciones para comprobar que entre ellas hay mínimo 1 casilla sin arbusto
        // si se cumple se añade el tipo arbusto, si no se genera otra posición

        // las posiciones (celdas) generadas en el array bidimensional se van a guardar en un nuevo array unidimensional (son referencias)
        // en la lista se quitan las casillas de las esquinas
        // se seleccionan tantas casillas como arbustos se quieran añadir, tomando el largo del array y se miran sus vecinos
        // si no hay arbusto en los vecinos se añade el arbusto y se sacan los vecinos de la lista con un splice


        for(let i = 0; i < this.board.size; i++) {
            for(let j = 0; j < this.board.size; j++) {
                // se generan las coordenadas del arbusto de forma aleatoria
                let bushi : number = Math.floor(Math.random() * (map.length - 1));
                let bushj : number = Math.floor(Math.random() * (map.length - 1));
                // cada arbusto tiene que estar separado por una casilla vacía, siempre hay una diferencia de 1 absoluto
                if ((Math.abs(map[i][j].x - bushi)) + (Math.abs(map[i][j].y - bushj)) === 1 ||
                    (Math.abs(map[i][j].x - bushi) === 1 && Math.abs(map[i][j].y - bushj) === 1)){
                    map[i][j].type = 2;
                    this.board.elements.push({x : i, y : j, type : map[i][j].type, obj : map[i][j].obj});
                }
                if( ( (i === 0) && (j === 0) ) ||   //0,0
                    ( (i === map.length-1) && (j === 0) ) ||  //9,0
                    ( (i === 0) && (j === map.length-1) ) ||    //0,9
                    ( (i === map.length-1) && (j === map.length-1) ) ) {    //9,9
                    map[i][j].type = 1;
                    if(map[i][j].type != 0) {
                        this.board.elements.push({x : i, y : j, type : map[i][j].type, obj : map[i][j].obj});
                    }
                }
            }
        }
        
    }

    public getBoard() : Board {
        return this.board;
    }

}