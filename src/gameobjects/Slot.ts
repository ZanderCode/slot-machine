import {GameObjects, AXIS} from "./GameObject";
import * as PIXI from 'pixi.js';

export enum SlotState{
    RUNNING,
    STOPPED
}

// A [Slot] will create sprites and align
// them, and scroll them upon a state change.
export class Slot implements GameObjects{

    public children:PIXI.Sprite[];
    public child:PIXI.Container;
    private moveAmount:number;
    private _isMoving:boolean;
    private _axis:AXIS;
    private _container:PIXI.Container;

    public state:SlotState;

    private _size:number;
    public visibleObjects:number;

    private _textures:PIXI.Texture[];

    isActive: boolean;

    targets:PIXI.Texture[];
    private alignTargets:boolean;
    private alignTargetIndex:number;
    private aligned:boolean;

    constructor(textures:PIXI.Texture[],
        visibleObjects:number=3,
        dim?:number,
        axis?:AXIS,
        moveAmount?:number){

        this.visibleObjects = visibleObjects;
        this.moveAmount = moveAmount??10;
        this._isMoving = false;
        this.isActive = false;
        this._axis=axis??AXIS.Vertical;
        this._size = dim??100;
        this._textures = textures;
        this._container = new PIXI.Container();
        this.child = this._container;

        this.targets = []
        this.alignTargets = false;
        this.alignTargetIndex = 0;
        this.aligned = false;
           
        // Create a Mask to hide off-screen elements of the slider
        let borderMask = new PIXI.Container();
        let g = new PIXI.Graphics();
        g.beginFill(0xff0000);
        if (this._axis === AXIS.Vertical){
            g.drawRect(0,0,this._size,this.visibleObjects*this._size);
        }else{
            g.drawRect(0,0,this.visibleObjects*this._size,this._size);
        }
        borderMask.addChild(g);
        this._container.addChild(borderMask);
        this._container.mask = borderMask;

        // Add a boarder so we know the bounds
        let border = new PIXI.Container();
        let g2 = new PIXI.Graphics();
        g2.beginFill(0xCCCCCC);
        if (this._axis === AXIS.Vertical){
            g2.drawRect(0,0,this._size,this.visibleObjects*this._size);
        }else{
            g2.drawRect(0,0,this.visibleObjects*this._size,this._size);
        }
        border.addChild(g2);
        this.child.addChild(border);

        
        this.children = []

        while(this._textures.length < visibleObjects+1){
            this._textures.push(textures[Math.floor(Math.random()*textures.length)]);
        }
        
        this.children.push(...textures.flatMap((tex)=>{
            let spr = new PIXI.Sprite(tex);
            spr.width = this._size;
            spr.height = this._size;
            return spr;
        }));

        this._container.addChild(...this.children);
        this.state = SlotState.STOPPED;
        this._align();
    }

    // Starts the [Slot] reel animation and sets
    // appropriate flags for [frame()] function
    //
    // target: can be defined to specifc what slot
    // will look like when [stop()] is called.
    start(target?:PIXI.Texture[]){
        this.state = SlotState.RUNNING;
        if (target !== undefined && target.length !== 0){
            this.targets = target;
            this.alignTargetIndex = target.length-1;
        }
        this.isActive = true;
        this._isMoving = true;
    }

    // Stops the [Slot] by setting appropriate flags
    stop(){
        if (this.targets !== undefined && this.targets.length !== 0){
            this.alignTargets = true;
        }else{
            this.aligned = true;
            this._align();
        }
    }

    frame(delta:number):void{

        if (!this.isActive){
            return;
        }

        this._align();

        // Since all elements are based on the position of the first, we just need to move the first,
        // then the rest of the childnre follow:
        if (this._isMoving){
            if (this._axis === AXIS.Horizontal){
                this.children[0].transform.position.x = this.children[0].position.x + (this.moveAmount*delta)
            }else if (this._axis === AXIS.Vertical){
                this.children[0].transform.position.y = this.children[0].position.y + (this.moveAmount*delta)
            }

            // When a symbol goes off screen, we want to shift it back to the top,
            // the is the reel animation bevaior.
            if((this.children[this.children.length-1].transform.position.y > this.visibleObjects*this._size) || 
            (this.children[this.children.length-1].transform.position.x > this.visibleObjects*this._size)){
                // Usually we want to stop movement right when the last symbol went off screen:
                if (this.aligned){
                    this.state = SlotState.STOPPED;
                    this._isMoving = false;
                    this.aligned = false;
                    this._align(true);
                }
                this.shift()
            }
        }   
    }

    // Depeding on the AXIS direction, the elements that went off screen -
    // the last symbols in the [children] object - will be set back to the front of
    // list and will be moved to the top of the reel.  
    private shift(){
        let last = this.children[this.children.length-1]
        if (this._axis === AXIS.Vertical){
            this.children.pop();
            last.setTransform(0,this.children[0].transform.position.y-this._size,last.scale.x,last.scale.y);
            this.children.unshift(last);
        }else{
            this.children.pop();
            last.setTransform(this.children[0].transform.position.x-this._size,0,last.scale.x,last.scale.y);
            this.children.unshift(last);
        }

        // If we have targets, then we should be able specify those and have our [Slot] reel
        // stop on those targets. We shall [shift()] them in one at a time and then stop the reel.
        if (this.targets !== undefined && this.targets.length !== 0 && this.alignTargets){
            last.texture = this.targets[this.alignTargetIndex];
            this.alignTargetIndex-=1;
            if(this.alignTargetIndex < 0 && this.alignTargets){
                this.alignTargetIndex=this.targets.length-1;
                this.alignTargets = false;
                this.aligned = true;
            }
        }else{ // If we have no targets, then just assign the last symbol to something random.
            last.texture = this._textures[Math.floor(Math.random()*this._textures.length)];
        }
    }

    private _align(once?:boolean){
        
        if (this._axis === AXIS.Horizontal){
            if (once){
                this.children[0].transform.position.x = 0;
            }
            for(let prev = 0,next = 1; next<this.children.length;next++,prev++){
                this.children[next].transform.position.x = this.children[prev].transform.position.x + this.children[prev].getBounds().width;
            }
        }else if(this._axis === AXIS.Vertical){ 
            if (once){
                this.children[0].transform.position.y = 0;
            }
            for(let prev = 0,next = 1; next<this.children.length;next++,prev++){
                this.children[next].transform.position.y = this.children[prev].transform.position.y + this.children[prev].getBounds().height;
            }
        }
    }

    getRenderable():PIXI.Container{
        return this.child;
    }

}