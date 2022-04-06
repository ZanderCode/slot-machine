import {GameObjects, AXIS} from "./GameObject";
import * as PIXI from 'pixi.js';
import { runInThisContext } from "vm";

export enum TargetType{
    Random,
    Normal
}

// TODO: change to Slot
export class MovingColumn implements GameObjects{

    public children:PIXI.DisplayObject[];
    public child:PIXI.Container;
    private moveAmount:number;
    private _isMoving:boolean;
    private _axis:AXIS;
    private _container:PIXI.Container;

    private _dim:number;
    private _visibleObjects:number;


    constructor(container:PIXI.Texture[],
        isMoving?:boolean,
        visibleObjects?:number,
        dim?:number,
        axis?:AXIS,
        moveAmount?:number){

        if (container.length < 2){
            console.error("The number of elements in a MovingColumn should be 2 or more.");
        }

        if (visibleObjects??container.length-1 >= container.length){
            console.error("The number of visible objects must be 1 less than the total number of children objects.");
        }

        this._visibleObjects = visibleObjects??container.length-1;
        this.moveAmount = moveAmount??10;
        this._isMoving = isMoving??false;
        this._axis=axis??AXIS.Vertical;
        this._dim = dim??100;

        this._container = new PIXI.Container();
        this.child = this._container;
           

        // Create a Mask to hide off-screen elements of the slider
        let borderMask = new PIXI.Container();
        let g = new PIXI.Graphics();
        g.beginFill(0xff0000);
        if (this._axis === AXIS.Vertical){
            g.drawRect(0,0,this._dim,this._visibleObjects*this._dim);
        }else{
            g.drawRect(0,0,this._visibleObjects*this._dim,this._dim);
        }
        borderMask.addChild(g);
        this._container.addChild(borderMask);
        this._container.mask = borderMask;

        // Add a boarder so we know the bounds
        let border = new PIXI.Container();
        let g2 = new PIXI.Graphics();
        g2.beginFill(0x0000ff);
        if (this._axis === AXIS.Vertical){
            g2.drawRect(0,0,this._dim,this._visibleObjects*this._dim);
        }else{
            g2.drawRect(0,0,this._visibleObjects*this._dim,this._dim);
        }
        border.addChild(g2);
        this.child.addChild(border);

        // Create sprites out of the textures
        this.children = [];
        this.children.push(...container.flatMap((c)=>{
            let sprt = new PIXI.Sprite(c);
            sprt.width = this._dim;
            sprt.height = this._dim;
            return sprt;
        }))     
        this._container.addChild(...this.children);
    }

    animate(delta:number):void{
        this._align();

        // Since all elements are based on the position of the first, we just need to move the first,
        // then the rest of the childnre follow.
        
        if (this._isMoving){
            if (this._axis === AXIS.Horizontal){
                this.children[0].transform.position.x = this.children[0].position.x + (this.moveAmount*delta)
            }else if (this._axis === AXIS.Vertical){
                this.children[0].transform.position.y = this.children[0].position.y + (this.moveAmount*delta)
            }

            // Dont if an item goes off screen define its behavior here.
            // for example, we can move the last item that went off screen to the
            // top of the container. Or we can completley generate a new object to
            // place at the top and delete the one that went off screen.
            // TODO: Add a factory class that creates MovableColumns
                // MovableColumns.NextRandom
                // MoveableComuns.DefinedList 

            if(this.children[this.children.length-1].transform.position.y > this._visibleObjects*this._dim){
                this.shift()
            }else if(this.children[this.children.length-1].transform.position.x > this._visibleObjects*this._dim){
                this.shift()
            }
        }   
    }

    private shift(){
        if (this._axis === AXIS.Vertical){
            let last = this.children[this.children.length-1]
            this.children.pop();
            last.setTransform(0,this.children[0].transform.position.y-this._dim,last.scale.x,last.scale.y);
            this.children.unshift(last);
        }else{
            let last = this.children[this.children.length-1]
            this.children.pop();
            last.setTransform(this.children[0].transform.position.x-this._dim,0,last.scale.x,last.scale.y);
            this.children.unshift(last);
        }
    }

    private _align(){
        if (this._axis === AXIS.Horizontal){
            for(let prev = 0,next = 1; next<this.children.length;next++,prev++){
                this.children[next].transform.position.x = this.children[prev].transform.position.x + this.children[prev].getBounds().width;
            }
        }else if(this._axis === AXIS.Vertical){ 
            for(let prev = 0,next = 1; next<this.children.length;next++,prev++){
                this.children[next].transform.position.y = this.children[prev].transform.position.y + this.children[prev].getBounds().height;
            }
        }
    }

    // Behavior:
    onClick(){
        this._isMoving = !this._isMoving;
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}