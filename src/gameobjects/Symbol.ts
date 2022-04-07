import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Symbol<T> implements GameObject{

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
            this.child.setTransform(this.child.x,this.child.y+(5*delta))
        }
    }

    getCopy():Symbol<T>{
        let symb:Symbol<T>;
        symb = new Symbol<T>(this.child.texture,this.type);
        return symb;
    }

    getValue():T{
        return this.type;
    }

    getRenderable():PIXI.Sprite{
        return this.child;
    }

}