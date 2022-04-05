import { Renderer } from './renderer/renderer';
import {AXIS} from "./gameobjects/GameObject";
import {Card} from "./gameobjects/Card";
import {MovingColumn} from "./gameobjects/MovingColumn";
import * as PIXI from "pixi.js";

export class App {
  private _renderer: Renderer;
  private _textures:Map<string,PIXI.Texture>;

  public constructor() {
    this._renderer = new Renderer();
    this._textures = new Map<string,PIXI.Texture>();

    //LOAD ASSETS
    this._renderer.addAssets(
      (loader:PIXI.Loader)=>{
        loader.load((ldr, res) => {
          // Create Sprites out of each of the loaded assets and stage them.
          Object.entries(res).map((res)=>{
            let tex = loader.resources[res[0]].texture;
            this._textures.set(res[0],tex);
            let sprite = new PIXI.Sprite(tex);
            this._renderer.addToStage(sprite);
          });      
        });
      },
      this._constructSlot,
      "test.png",
      "test1.png",
    );
  }


  private _constructSlot(){
    let c1 = new Card(new PIXI.Sprite(this._textures.get("test")));
    c1.child.transform.scale.x = 100;
    c1.child.transform.scale.y = 100;
    let c2 = new Card(new PIXI.Sprite(this._textures.get("test")));
    c2.child.transform.scale.x = 100;
    c2.child.transform.scale.y = 100;

    //BUILD SLOT MACHINE
    let mc = new MovingColumn([c1.getRenderable(),c2.getRenderable()],AXIS.Horizontal,10);
    mc.child.transform.scale.x = 100;
    mc.child.transform.scale.y = 100*mc.children.length;

    this._renderer.addToStage(mc.getRenderable());
  }

  private _loop(){

  }
}
