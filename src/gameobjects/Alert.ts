import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Alert implements GameObject{

    child: PIXI.Sprite;
    isActive: boolean;
    type:T;
    tex:PIXI.Texture;

    constructor(tex:PIXI.Texture,type:T){
        this.child = new PIXI.Sprite(tex);
        this.isActive = false;
        this.type = type;
        this.tex = tex;
    }

    frame(delta:number):void{
        if(this.isActive){
            
        }
    }

    getRenderable():PIXI.Sprite{
        return this.child;
    }

}