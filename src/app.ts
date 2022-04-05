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

    // TODO: create as many sprites, GameObjects, etc.
    // this below example just creates a sprite from each loaded texture.
    // this._dataResources.forEach((data)=>{
    //   let texture = this._loader.resources[data.name]?.texture;
    //   // Create Sprites
    //   if (texture){
    //     this._gameObjects.set(data.name, new Card(new PIXI.Sprite(texture)));
    //   }
    // })

     // Create three sprites
     let texName = this._dataResources[0].name;
     let tex = this._loader.resources[texName].texture;

     let sp1 = PIXI.Sprite.from(tex);
     sp1.width = 100;
     sp1.height = 100;
     let sp2 = PIXI.Sprite.from(tex);
     sp2.width = 200;
     sp2.height = 200;
     let sp3 = PIXI.Sprite.from(tex);
     sp3.width = 100;
     sp3.height = 100;

     let moving = new MovingColumn([sp1,sp2,sp3],AXIS.Horizontal);

     this._gameObjects.set("moving",moving);

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