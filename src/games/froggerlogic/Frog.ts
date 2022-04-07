import {GameObject} from "../../gameobjects/GameObject";
import * as PIXI from 'pixi.js';
import { markAsUntransferable } from "worker_threads";

export class Frog implements GameObject{

    child: PIXI.Sprite;
    isActive: boolean;

    constructor(frog:PIXI.Texture, size:number){
        this.child = new PIXI.Sprite(frog);
        this.child.width = size;
        this.child.height = size;
    }

    async followPath(matrix:Array<PIXI.Sprite[]>,walkableTextures:PIXI.Texture){
        for(let col=0; col<matrix.length;col++){
            for(let row=0; col<matrix[col].length;row++){
                if (matrix[col][row].texture === walkableTextures){
                    this.child.transform.position.y = matrix[col][row].transform.position.y;
                    this.child.transform.position.x = matrix[col][row].getBounds().x;
                    await new Promise(resolve => setTimeout(resolve, 100));
                    break;
                }
            }
        }

        //await new Promise(resolve => setTimeout(resolve, 500));
    }

    frame(delta:number){
        if (this.isActive){

        }
    }

    getRenderable():PIXI.Sprite{
        return this.child;
    };

}