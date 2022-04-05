import * as PIXI from 'pixi.js';
import { ObjectFlags } from 'typescript';

export class Renderer {
  private _application: PIXI.Application; 
  private _loader:PIXI.Loader;

  public constructor() {

    this._application = new PIXI.Application({
      backgroundColor: 0x333333,
      autoStart: true,
    });

    document.body.appendChild(this._application.view);
    
    // Defines where general assets are. Non-game breaking assets
    this._loader = PIXI.Loader.shared;
    this._loader.baseUrl = "assets/";
  }

  addAssets(addedAssets:Function,onComplete:Function,...assets:string[]){
    
    //Asset file is the same as the asset name file+ext (ex. "ball_x" and "ball_x.png")
    assets.forEach((fileName,i)=>{
      this._loader.add(fileName.split(".")[0],fileName);
    });

    // Do something with the loaded assets.
    addedAssets(this._loader);
    this._loader.onComplete.add(()=>onComplete);

    // TODO:remove game loop; place elsewhere
    this._loader.onComplete.add(()=>{
      this._application.ticker.add(()=>{

      });
    });
  }

  // Exposes stage to entire app
  addToStage(...stageable:PIXI.DisplayObject[]){
    this._application.stage.addChild(...stageable);
  }
}

export default Renderer;
