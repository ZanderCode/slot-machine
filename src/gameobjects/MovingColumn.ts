import {GameObjects, AXIS} from "./GameObject";
import * as PIXI from 'pixi.js';

// TODO: change to Slot
export class MovingColumn implements GameObjects{

    children:PIXI.DisplayObject[];
    child:PIXI.Container;
    private moveAmount:number;
    private _isMoving:boolean;
    private _axis:AXIS;
    private _container:PIXI.Container;

    private _dim:number;
    private _visibleObjects:number;


    constructor(container:PIXI.DisplayObject[],
        visibleObjects:number,
        dim:number,
        isMoving?:boolean,
        axis?:AXIS,
        moveAmount?:number){

        if (visibleObjects >= container.length){
            console.error("The number of visible objects must be 1 less than the total number of children objects");
        }

        this._visibleObjects = visibleObjects;
        this._dim = dim;

        this.children = container;
        this._isMoving = isMoving??false;
        this._axis=axis??AXIS.Vertical;
        this._container = new PIXI.Container();
        this.child = this._container;

        let boarderMask = new PIXI.Container();
        let g = new PIXI.Graphics();
        g.beginFill(0xff0000);
        g.drawRect(0,0,this._dim,visibleObjects*this._dim);
        boarderMask.addChild(g);
        this._container.addChild(boarderMask);

        let boarder = new PIXI.Container();
        let g2 = new PIXI.Graphics();
        g2.beginFill(0x0000ff);
        g2.drawRect(0,0,this._dim,visibleObjects*this._dim);
        boarder.addChild(g2);
        
        this._container.mask = boarder;
        this.child.addChild(boarder);
        this._container.addChild(...this.children);
        this.moveAmount = moveAmount??10;

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
            }
        }   
    }

    //TODO: add directiopn
    private shift(){
        let last = this.children[this.children.length-1]
        this.children.pop();
        last.setTransform(0,this.children[0].transform.position.y-this._dim,last.scale.x,last.scale.y);
        this.children.unshift(last);
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

    onClick(){
        this._isMoving = !this._isMoving;
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}