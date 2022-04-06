import * as PIXI from 'pixi.js';

export interface GameObject{

    isActive:boolean;
    frame:Function;
    child:PIXI.DisplayObject;
    getRenderable:()=>PIXI.DisplayObject;

}

export interface GameObjects extends GameObject{
    axis?:AXIS
}

export enum AXIS{
    Horizontal,
    Vertical
}