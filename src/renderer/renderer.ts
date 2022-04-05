import * as PIXI from 'pixi.js';

export class Renderer {
  private _application: PIXI.Application; 
  private _loader:PIXI.Loader;

  public constructor() {

    this._application = new PIXI.Application({
      backgroundColor: 0x333333,
      autoStart: true,
    });

    document.body.appendChild(this._application.view);
    
    this._loader = PIXI.Loader.shared;
    this._loader.baseUrl = "assets/";
  }

  addAssets(...assets:string[]){
    
    var sprites:PIXI.Sprite[] = [];

    //Asset file is the same as the asset name file+ext (ex. "ball_x" and "ball_x.png")
    assets.forEach((fileName,i)=>{
      this._loader.add(fileName.split(".")[0],fileName);
    });

    this._loader.load((loader, resources) => {
      Object.entries(resources).map((res)=>{
        // Load sprite name from resources [res] which we added above
        let tex = loader.resources[res[0]].texture;
        let sprite = new PIXI.Sprite(tex);
        this.addToStage(sprite);
      });      
    });
  }

  loop(gameLoop:Function){
    this._loader.onComplete.add(()=>{
      this._application.ticker.add((delta)=>{
      
        let y = this._application.stage.children[0].transform.position.y;
        let height = (<PIXI.Sprite> this._application.stage.children[0]).width;

        this._application.stage.children[0].transform.position.y = y + 10*delta; 

        if (y > this._application.screen.height){
          this._application.stage.children[0].transform.position.y = height * -1;
        }
      
      });
    });
  }

  // Exposes stage to App
  addToStage(...stageable:PIXI.DisplayObject[]){
    this._application.stage.addChild(...stageable);
  }
}

export default Renderer;
