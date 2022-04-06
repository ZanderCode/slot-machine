import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Lever implements GameObject{

    child: PIXI.Container;
    isActive: boolean;
    willRegister:boolean;
    private _g:PIXI.Graphics;

    constructor(pullBehavior:Function,width:number,height:number){

        this.isActive = false;
        this.willRegister = true;
        this.child = new PIXI.Container();

        this._g = new PIXI.Graphics();
        this._g.beginFill(0xff0000);
        this._g.drawCircle(200,200,100);
        this.child.addChild(this._g);

        this._g.interactive = true;
        this._g.addListener("click", pullBehavior);
    }
    
    //TODO: chagne
    moveAmount:number = 100;
    moveBy:number = 1;
    moveTotal:number = 0;
    isMovingDown:boolean = true;
    frame(delta:number):void{
        if(this.isActive){
            if (this.isMovingDown){
                this._g.transform.position.y += this.moveBy;
                this.moveTotal += this.moveBy;
                if(this.moveTotal >= this.moveAmount){
                    this._g.transform.position.y = this.moveAmount;
                    this.isMovingDown = false;
                }
            }else{
                this._g.transform.position.y -= this.moveBy;
                this.moveTotal += this.moveBy;
                if(this.moveTotal <= 0){
                    this._g.transform.position.y = 0;
                    this.isMovingDown = true;
                    this.isActive = false;
                    return;
                }
            }
        }
    }

    async onClick(action:Function){
        // Click and reset once done.
        if (!this.isActive && this.willRegister){
            this.isActive = true;
            this.willRegister = false;
            await action().then(()=>{
                this.willRegister = true;
            });
        }
    }

    getRenderable():PIXI.DisplayObject{
        return this.child;
    }
}