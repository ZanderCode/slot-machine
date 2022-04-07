import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Alert implements GameObject{

    child: PIXI.Sprite;
    isActive: boolean;

    constructor(message:string){
        this.child = new PIXI.Text(message);
        this.isActive = false;
    }

    frame(delta:number):void{
        if(this.isActive){
            
        }
    }

    getRenderable():PIXI.Sprite{
        return this.child;
    }

}