import * as PIXI from 'pixi.js';
import { GameObject } from "../gameobjects/GameObject"

export class Renderer{
  private _application: PIXI.Application; 

  constructor(canvas:HTMLCanvasElement) {
    this._application = new PIXI.Application({
      backgroundColor: 0xffffff,
      height:300,
      view:canvas,
      autoStart:true,
      sharedLoader:false
    });

  }

  getWidth():number{
    return this._application.view.width;
  }

  
  getHeight():number{
    return this._application.view.height;
  }

  // Exposes stage to App
  addToStage(...stageable:PIXI.DisplayObject[]){
    this._application.stage.addChild(...stageable);
  }

  // Exposes the application ticker to allow for custom loops
  loop(gameLoop:Function,gameObjects:Map<string,GameObject>,textures:Map<string,PIXI.Texture>){
    this._application.ticker.add((delta)=>gameLoop(delta,gameObjects,textures));
  }
}

export default Renderer;
