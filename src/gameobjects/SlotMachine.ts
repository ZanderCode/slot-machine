import {GameObjects, AXIS} from "./GameObject";
import {Lever} from "./Lever";
import {Slot} from "./Slot";
import * as PIXI from 'pixi.js';


export enum SlotStates{
    IDLE,
    ROLLING,
    STOPPING,
    PRIZE
}

export class SlotMachine implements GameObjects{

    children: PIXI.DisplayObject[];
    child:PIXI.Container;

    private _slots:Slot[]
    private _lever:Lever;

    isActive: boolean;
    axis: AXIS;

    public slotState:SlotStates;
    private targets:Array<PIXI.Texture[]>;

    constructor(lever:Lever,slots:Slot[],targets?:Array<PIXI.Texture[]>){
        this.children = [];
        this.child = new PIXI.Container();
        this.axis = AXIS.Vertical;

        this._slots = slots;
        this._lever = lever;

        // TODO: check coltargs. If invalid dimensions (nxm), then choose random and console log error.
        // where n = slots.length
        // and   m = visibleObjects for each [Slot] reel
        
        this.targets = targets??[];
        if(!this.areValidTargs(this.targets,slots)){
            this.targets = [];
        }


        this.slotState = SlotStates.IDLE; 

        // Add the [Slot]s as children of the [SlotMachine]
        // Add the [Lever] as a child of the [SlotMachine]
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

    // There must be equal number of targets in each [Slot] reel
    // as there are targets in each of the rows of [slots] respectively.
    areValidTargs(targs:Array<PIXI.Texture[]>,slots:Slot[]):boolean{
        if (slots.length !== targs.length) return false;
        for(let i=0; i<slots.length;i++){
            if (slots[i].visibleObjects !== targs[i].length) return false
        }
        return true;
    }

    async start(colTargs?:Array<PIXI.Texture[]>){

        // Has targets
        if(colTargs !== undefined && colTargs.length !== 0){
            if (this.areValidTargs(colTargs,this._slots)){
                this.targets = colTargs;   
            }
        }

        this.slotState = SlotStates.ROLLING;
        for (let i=0;i<this._slots.length;i++){
            this._slots[i].start(this.targets?this.targets[i]:undefined);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async stop(){
        this.slotState = SlotStates.STOPPING;
        for (let i=0;i<this._slots.length;i++){
            this._slots[i].stop();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        this.slotState = SlotStates.PRIZE;
    }

    public getResult():Array<PIXI.Sprite[]>{
        let texturesMatrix:Array<PIXI.Sprite[]> = [];
        for (let i=0;i<this._slots.length;i++){
            let slot:Slot = this._slots[i]; 
            let sprites:PIXI.Sprite[] = slot.children.slice(1,slot.visibleObjects+1)
            texturesMatrix.push(sprites);
        }
        return texturesMatrix;
    }

    frame(delta:number):void{}

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}