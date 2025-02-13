import { Player } from "./Player";
import { Bush } from "./Bush";

export interface Element {
    x : number;
    y : number;
    type : number;
    obj : Player | Bush | null;
}

export interface Board {
    size: number;
    elements: Array<Element>;
}