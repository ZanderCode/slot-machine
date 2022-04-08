import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

// This class was never used, but in the future,
// I plan to have Symbols be passed into the [Slot]
// class. That way when prize checking occurs
// after the user spins the [SlotMachine], I can
// check against Symbol types instead of directly,
// checking the [PIXI.Sprite]s.
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