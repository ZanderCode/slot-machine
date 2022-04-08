import {GameObject} from "../../gameobjects/GameObject";
import * as PIXI from 'pixi.js';
import { markAsUntransferable } from "worker_threads";
import { textChangeRangeIsUnchanged } from "typescript";

export class Frog implements GameObject{

    child: PIXI.Sprite;
    isActive: boolean;

    private path:PIXI.Sprite[];

    constructor(frog:PIXI.Texture, size:number){
        this.child = new PIXI.Sprite(frog);
        this.child.width = size;
        this.child.height = size;

        this.child.transform.position.x = - this.child.width;
    }

    async followPath(matrix:Array<PIXI.Sprite[]>,walkableTextures:PIXI.Texture):Promise<boolean>{


        let path = this.getPath(matrix,walkableTextures);
        if (path.length == 0) return false;

        this.isActive = true;

        for(let i=0; i<path.length;i++){
            let spr = path[i];
            this.child.transform.position.y = spr.transform.position.y;
            this.child.transform.position.x = spr.getBounds().x;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        this.child.transform.position.x = - this.child.width;

        return true;
    }

    getPath(matrix:Array<PIXI.Sprite[]>,walkable:PIXI.Texture):PIXI.Sprite[]{

        let path:PIXI.Sprite[] = [];

        let hasStart:boolean = false;
        let rows:number[] = [];
        for (let i=0; i < matrix[0].length;i++){
            if (matrix[0][i].texture === walkable){
                hasStart = true;
                rows.push(i);
            }
        } 
        for(let row=0;row<rows.length;row++){
            path = [matrix[0][rows[row]]];
            let p = this.recursivePath(matrix,path,rows[row],0,walkable);
            if (matrix[matrix.length-1].includes(p[p.length-1])){return p}
        }

        return [];
    }

    recursivePath(matrix:Array<PIXI.Sprite[]>,path:PIXI.Sprite[],row:number,col:number,target:PIXI.Texture):PIXI.Sprite[]{

        // return path if its the frog is in the last column
        if (matrix[matrix.length-1].includes(path[path.length-1])){return path}

        let above:PIXI.Sprite = undefined;
        let below:PIXI.Sprite = undefined;
        let forward:PIXI.Sprite = undefined;

        // Find the next path to take:

        if (row+1 <= matrix[col].length-1){ // below
            if (!path.includes(matrix[col][row+1])){ // should not be the previous path
                if (matrix[col][row+1].texture == target){
                    below = matrix[col][row+1];
                }
            } 
        } 
        if (row-1 >= 0){ // above
            if (!path.includes(matrix[col][row-1])){ // should not be the previous path
                if (matrix[col][row-1].texture == target){
                    above = matrix[col][row-1];
                }
            } 
        }                    
        if (col+1 <= matrix.length-1){ // forward
            if (matrix[col+1][row].texture == target){
                forward = matrix[col+1][row];
            }
        }    
        
        let p1 = undefined;
        let p2 = undefined;
        let p3 = undefined;

        // Recurse with new paths
        if (forward !== undefined) {
            p1 = this.recursivePath(matrix,[...path, forward],row,col+1,target);
            if (matrix[matrix.length-1].includes(p1[p1.length-1])){return p1}
        }
        if (above !== undefined) {
            p2 = this.recursivePath(matrix,[...path, above],row-1,col,target);
            if (matrix[matrix.length-1].includes(p2[p2.length-1])){return p2}
        }
        if (below !== undefined) {
            p3 =  this.recursivePath(matrix,[...path, below],row+1,col,target);
            if (matrix[matrix.length-1].includes(p3[p3.length-1])){return p3}
        }
        return []; // no last column.... failed
    }

    frame(delta:number){
        if (this.isActive){

        }
    }

    getRenderable():PIXI.Sprite{
        return this.child;
    };

}