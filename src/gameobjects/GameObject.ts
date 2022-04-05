import * as PIXI from 'pixi.js';

export interface GameObject{

    animate:Function;
    child:PIXI.DisplayObject;
    onClick?:Function;
    getRenderable:()=>PIXI.DisplayObject;

}

export interface GameObjects extends GameObject{
    axis?:AXIS
}

export enum AXIS{
    Horizontal,
    Vertical
}