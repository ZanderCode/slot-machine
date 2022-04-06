import { Renderer } from './renderer/renderer';
import {GameObject, AXIS} from "./gameobjects/GameObject";
import {SlotMachine} from "./gameobjects/SlotMachine";
import {Slot} from "./gameobjects/Slot";
import {Symbol} from "./gameobjects/Symbol";
import * as PIXI from "pixi.js";
import { Lever } from './gameobjects/Lever';
import { TetrisTypes } from './TetrisTypes';

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
    
    // Create GameObject and other renderables.
    let tex1Name = this._dataResources[0].name;
    let tex2Name = this._dataResources[1].name;
    let tex1 = this._loader.resources[tex1Name].texture;
    let tex2 = this._loader.resources[tex2Name].texture;
    let dim:number = 100;

    let moving = new Slot([tex1,tex2,tex1,tex2,tex1,tex2,tex1],false,3,dim,AXIS.Vertical,10);
    let moving2 = new Slot([tex2,tex1,tex2,tex1,tex2,tex1,tex2],false,3,dim,AXIS.Vertical,10);
    moving2.child.position.x = dim;

    let L = new Symbol<TetrisTypes>(tex1,TetrisTypes.L);
    let J = new Symbol<TetrisTypes>(tex1,TetrisTypes.J);
    let S = new Symbol<TetrisTypes>(tex1,TetrisTypes.S);
    let Z = new Symbol<TetrisTypes>(tex1,TetrisTypes.Z);
    let O = new Symbol<TetrisTypes>(tex1,TetrisTypes.O);
    let T = new Symbol<TetrisTypes>(tex1,TetrisTypes.T);
    let I = new Symbol<TetrisTypes>(tex1,TetrisTypes.I);
    
    let lever = new Lever(async ()=>{
      await slot.start();
      await slot.stop();
    },100,300);

    let slot = new SlotMachine(lever,[moving,moving2]);
    
    // Stage All
    this._gameObjects.set("Slot1",moving);
    this._gameObjects.set("Slot2",moving2);
    this._gameObjects.set("Lever",lever);
    this._gameObjects.set("SlotMachine",slot);
    this._gameObjects.forEach((go)=>this._renderer.addToStage(go.getRenderable()));

    // Start Game Loop
    // In order to use the gameLoop callback, we must pass through
    // all of the game objects created by this function.
    if(startGameLoop){
      this._renderer.loop(this.gameLoop,this._gameObjects);
    }
  }

  // Game Logic and state management
  // States = Idle, Rolling, Stopping, Prize
  gameLoop(delta:number,gameObjects:Map<string,GameObject>){
    gameObjects.forEach(go => {
      go.frame(delta);
    });
  }

}