import * as PIXI from 'pixi.js';
import { GameObject } from "../gameobjects/GameObject"

export class Renderer{
  private _application: PIXI.Application; 

  constructor(canvas:HTMLCanvasElement) {
    this._application = new PIXI.Application({
      backgroundColor: 0x333333,
      height:300,
      view:canvas,
      autoStart:true,
    });

    document.body.prepend(this._application.view);
  }

  // Exposes stage to App
  addToStage(...stageable:PIXI.DisplayObject[]){
    this._application.stage.addChild(...stageable);
  }

  // Exposes the application ticker to allow for custom loops
  loop(gameLoop:Function,gameObjects:Map<string,GameObject>){
    this._application.ticker.add((delta)=>gameLoop(delta,gameObjects));
  }
}

export default Renderer;
