import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Symbol<T> implements GameObject{

    child: PIXI.Sprite;
    isActive: boolean;
    type:T;

    constructor(tex:PIXI.Texture,type:T){
        this.child = new PIXI.Sprite(tex);
        this.isActive = false;
        this.type = type;
    }

    frame(delta:number):void{
        if(this.isActive){
            this.child.setTransform(this.child.x,this.child.y+(5*delta))
        }
    }

    getValue():T{
        return this.type;
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}