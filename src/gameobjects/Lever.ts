import {GameObject} from "./GameObject";
import * as PIXI from 'pixi.js';

export class Lever implements GameObject{

    child: PIXI.Container;
    isActive: boolean;
    willRegister:boolean;
    leverRadius:number;
    moveDistance:number;
    _g:PIXI.Graphics;
    _g2:PIXI.Graphics;
    _g3:PIXI.Graphics;
    text:PIXI.Text;

    constructor(x:number,y:number,radius:number,moveDistance:number){
        this.isActive = false;
        this.willRegister = true;
        this.child = new PIXI.Container();
        this.leverRadius = radius;
        this.moveDistance = moveDistance;

        // Create Ball Head
        this._g = new PIXI.Graphics();
        this.text = new PIXI.Text("Spin")
        this.text.scale.set(0.9,0.9);
        this.text.x = x;
        this.text.y = y;
        this.text.anchor.set(0.5);
        this.text.style = new PIXI.TextStyle({fill:0xffffff,fontWeight:"bold"});
        this.text.zIndex = 2;
        this._g.addChild(this.text)
        this._g.beginFill(0xff0000);
        this._g.drawCircle(x,y,radius);
        this._g.zIndex = 1;

        // Draw Lever
        this._g2 = new PIXI.Graphics();
        this._g2.beginFill(0xBBBBBB);
        this._g2.drawRect(x-(radius/4),y+radius,radius/2,moveDistance)
        this._g.addChild(this._g2);

        // Add Ball + Lever Combo
        this.child.addChild(this._g);

        // Create Lever Base
        this._g3 = new PIXI.Graphics();
        this._g3.beginFill(0xBBBBBB);
        this._g3.drawRoundedRect(x-radius,moveDistance+(radius),radius*2,radius*2,50);
        this._g3.zIndex = -1;
        this.child.addChild(this._g3);

        let mask = new PIXI.Graphics();
        mask.beginFill(0xff0000);
        mask.drawRect(x-radius,y-radius,radius*2,moveDistance+(radius*2));
        this.child.mask = mask;

        this.child.interactive = true;
    }

    addActivateBehavior(action:Function){
        this.child.addListener("click", ()=>{this.onClick(action)});
    }
    
    //TODO: chagne
    moveBy:number = 10;
    moveTotal:number = 0;
    isMovingDown:boolean = true;
    frame(delta:number):void{
        if(this.isActive){
            if (this.isMovingDown){
                this._g.transform.position.y += this.moveBy;
                this.moveTotal += this.moveBy;
                if(this.moveTotal >= this.moveDistance){
                    this._g.transform.position.y = this.moveDistance;
                    this.isMovingDown = false;
                }
            }else{
                this._g.transform.position.y -= this.moveBy;
                this.moveTotal -= this.moveBy;
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