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
    
    let tex1Name = this._dataResources[0].name;
    let tex2Name = this._dataResources[1].name;
    let tex1 = this._loader.resources[tex1Name].texture;
    let tex2 = this._loader.resources[tex2Name].texture;
    let dim = 100;

    let moving = new MovingColumn([tex1,tex2,tex1,tex2,tex1,tex2,tex1],true,undefined,dim,AXIS.Vertical);
    let moving2 = new MovingColumn([tex2,tex1,tex2,tex1,tex2],false,undefined,dim,AXIS.Horizontal);
    //let moving3 = new MovingColumn([sp8,sp9,sp10,sp11],true);
    moving2.child.position.x = dim+100;
    moving2.child.position.y = dim+100;
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