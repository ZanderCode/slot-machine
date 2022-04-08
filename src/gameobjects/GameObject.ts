import * as PIXI from 'pixi.js';


// Any object that renders and has
// frame based behavior should implement.
export interface GameObject{
    isActive:boolean;
    frame:Function;
    child:PIXI.DisplayObject;
    getRenderable:()=>PIXI.DisplayObject;
}

// This is the same as the above class, but 
// attempts to make use of obejct lists.
export interface GameObjects extends GameObject{
    axis?:AXIS
}
export enum AXIS{
    Horizontal,
    Vertical
}