import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Card implements GameObject{

    child: PIXI.DisplayObject;

    constructor(sprite:PIXI.Sprite){
        this.child = sprite;
    }

    animate(delta:number):void{
        this.child.setTransform(this.child.x,this.child.y+(5*delta))
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}