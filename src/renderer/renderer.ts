import * as PIXI from 'pixi.js';

export class Renderer {
  private _application: PIXI.Application; 

  public constructor() {

    this._application = new PIXI.Application({
      backgroundColor: 0x333333,
      autoStart: true,
    });

    document.body.appendChild(this._application.view);
    
  }

  loadAssets(...assets:string[]):PIXI.Sprite[]{
    const loader = PIXI.Loader.shared;
    loader.baseUrl = "assets/";

    loader.add('ball', 'assets/test.png')

    loader.load((loader, resources) => {

    });


    //TODO set
    return [];
  }

  // Exposes stage to App
  addToStage(stageable:PIXI.DisplayObject){
    this._application.stage.addChild(stageable);
  }
}

export default Renderer;
