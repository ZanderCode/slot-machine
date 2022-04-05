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

    // //LOAD ASSETS
    // this._renderer.addAssets(
    //   "test.png",
    //   "test1.png",
    // );

    // this._constructSlot();
    // this._renderer.loop(this.gameLoop);
  }


  private _constructSlot(){
    let c1 = new Card(new PIXI.Sprite(this._textures.get("test")));
    c1.child.transform.scale.x = 100;
    c1.child.transform.scale.y = 100;
    let c2 = new Card(new PIXI.Sprite(this._textures.get("test")));
    c1.child.transform.scale.x = 100;
    c1.child.transform.scale.y = 100;

    //BUILD SLOT MACHINE
    let mc = new MovingColumn([c1.getRenderable(),c2.getRenderable()],AXIS.Horizontal,10);
    mc.child.transform.scale.x = 100;
    mc.child.transform.scale.y = 100*mc.children.length;

    this._renderer.addToStage(mc.getRenderable());
  }

  gameLoop(){

  }

}
