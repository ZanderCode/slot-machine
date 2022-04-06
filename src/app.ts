import { Renderer } from './renderer/renderer';
import {GameObject, AXIS} from "./gameobjects/GameObject";
import {Card} from "./gameobjects/Card";
import {MovingColumn} from "./gameobjects/MovingColumn";
import * as PIXI from "pixi.js";

// Helper for managing data and starting
// Asset and GameObject creation during
// game start up
class DataResource{
  public name:string;
  public path:string;
  constructor(name:string,path:string ){
    this.name = name;
    this.path = path;
  }
}

// Main app:
// - Loads assets
// - Creates [GameObject]s
// - Starts game loop
export class App {
  private _renderer: Renderer;
  private _loader:PIXI.Loader;

  //_sprite:string refers to _dataResources.name
  private _dataResources:DataResource[];
  private _gameObjects:Map<string,GameObject>;

  public constructor() {
    this._renderer = new Renderer();
    this._dataResources = [];
    this._gameObjects = new Map<string,GameObject>();     

    // Load Assets, Create Game Objects
    this._loader = PIXI.Loader.shared;
    this._loader.baseUrl = "assets/";

    this.addDataResource("ball","test.png");
    this.addDataResource("ball1","test1.png");

    this._loader.onComplete.add(()=>this.createGameObjects(true));
    this._loader.load();
  }

  // Adds a new resource to the loader
  addDataResource(name:string,path:string){
    let res = new DataResource(name,path);
    this._loader.add(res.name,res.path);
    this._dataResources.push(res);
  }

  // All assets have been loaded, create [GameObjects] from them
  createGameObjects(startGameLoop:boolean=false){
    
     // Create three sprites
    let texName = this._dataResources[0].name;
    let texName2 = this._dataResources[1].name;
    let tex = this._loader.resources[texName].texture;
    let tex2 = this._loader.resources[texName2].texture;
    let dim = 100;

    // TODO: Refactor this nasty nasty. Place texture inside
    // MovingColumn. Generate sprites inside its constructor?
    let sp1 = PIXI.Sprite.from(tex);
    sp1.width = dim;
    sp1.height = dim;
    let sp2 = PIXI.Sprite.from(tex);
    sp2.width = dim;
    sp2.height = dim;
    let sp3 = PIXI.Sprite.from(tex);
    sp3.width = dim;
    sp3.height = dim;
    let sp7 = PIXI.Sprite.from(tex2);
    sp7.width = dim;
    sp7.height = dim;

    let sp8 = PIXI.Sprite.from(tex);
    sp8.width = dim;
    sp8.height = dim;
    let sp9 = PIXI.Sprite.from(tex);
    sp9.width = dim;
    sp9.height = dim;
    let sp10 = PIXI.Sprite.from(tex);
    sp10.width = dim;
    sp10.height = dim;
    let sp11 = PIXI.Sprite.from(tex2);
    sp11.width = dim;
    sp11.height = dim;

    let sp4 = PIXI.Sprite.from(tex);
    sp4.width = dim;
    sp4.height = dim;
    let sp5 = PIXI.Sprite.from(tex);
    sp5.width = dim;
    sp5.height = dim;
    let sp6 = PIXI.Sprite.from(tex);
    sp6.width = dim;
    sp6.height = dim;

    let moving = new MovingColumn([sp1,sp2,sp3],true,undefined,dim,AXIS.Vertical);
    let moving2 = new MovingColumn([sp4,sp5,sp6],true,undefined,dim,AXIS.Horizontal);
    //let moving3 = new MovingColumn([sp8,sp9,sp10,sp11],true);
    moving2.child.position.x = dim;
    //moving3.child.position.x = dim*2;

    this._gameObjects.set("moving",moving);
    this._gameObjects.set("moving2",moving2);
    //this._gameObjects.set("moving3",moving3);

    // Stage All
    this._gameObjects.forEach((go)=>this._renderer.addToStage(go.getRenderable()));

    // Start Game Loop
    // In order to use the gameLoop callback, we must pass through
    // all of the game objects created by this function.
    if(startGameLoop){
      this._renderer.loop(this.gameLoop,this._gameObjects);
    }
  }

  // Game Logic and state management
  gameLoop(delta:number,gameObjects:Map<string,GameObject>){
    gameObjects.forEach(go => {
      go.animate(delta);
    });
  }

}