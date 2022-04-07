import {GameObjects, GameObject, AXIS} from "./GameObject";
import {Lever} from "./Lever";
import {Slot} from "./Slot";
import {Symbol} from "./Symbol";
import * as PIXI from 'pixi.js';

export class SlotMachine implements GameObjects{

    children: PIXI.DisplayObject[];
    child:PIXI.Container;

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


        // Add the [Slot]s as children of the [SlotMachine]
        // Add the [Lever] as a chuld of the [SlotMachine]
        // Also move them into place.
        let prev:number = 0;
        for(let slotIndex = 0; slotIndex < slots.length; slotIndex++){
            slots[slotIndex].getRenderable().transform.position.x = prev;
            prev += slots[slotIndex].getRenderable().getBounds().width;
            this.child.addChild(slots[slotIndex].getRenderable());
        }
        this.child.addChild(lever.getRenderable());

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
        this._slots.forEach(s=>s.frame(delta));
        this._lever.frame(delta);
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}