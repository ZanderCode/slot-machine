import {GameObjects, AXIS} from "./GameObject";
import * as PIXI from 'pixi.js';
import { convertTypeAcquisitionFromJson } from "typescript";

export class MovingColumn implements GameObjects{

    children:PIXI.DisplayObject[];
    child:PIXI.Container;
    private moveAmount:number;
    private _isMoving:boolean;
    private _axis:AXIS;
    private _container:PIXI.Container;


    constructor(container:PIXI.DisplayObject[],isMoving?:boolean,axis?:AXIS,moveAmount?:number){
        this.children = container;
        this._isMoving = isMoving??false;
        this._axis=axis??AXIS.Vertical;
        this._container = new PIXI.Container();
        this.child = this._container;

        let boarder = new PIXI.Container();
        let g = new PIXI.Graphics();
        g.beginFill(0xff0000);
        g.drawRect(0,0,100,300);
        boarder.addChild(g);
        this._container.addChild(boarder);
        this._container.mask = boarder;

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

    onClick(){
        this._isMoving = !this._isMoving;
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }

}