import {GameObjects, GameObject, AXIS} from "./GameObject";
import {Lever} from "./Lever";
import {Slot} from "./Slot";
import {Symbol} from "./Symbol";
import * as PIXI from 'pixi.js';

export class SlotMachine implements GameObjects{

    children: PIXI.DisplayObject[];
    child:PIXI.DisplayObject;

    private _slots:Slot[]
    private _lever:Lever;

    isActive: boolean;
    axis: AXIS;

    constructor(lever:Lever,slots:Slot[]){
        this.children = [];
        this.child = new PIXI.Container();

        this.axis = AXIS.Vertical;

        this._slots = slots;
        this._lever = lever;

        this.isActive = false;
    }

    async start(){
        for (let i=0;i<this._slots.length;i++){
            this._slots[i].start();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async stop():Promise<Symbol<any>[]>{
        for (let i=0;i<this._slots.length;i++){
            this._slots[i].stop();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return [];
    }

    frame(delta:number):void{
        return;
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}