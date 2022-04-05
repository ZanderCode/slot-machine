import { Renderer } from './renderer/renderer';
import {AXIS} from "./gameobjects/GameObject";
import {Card} from "./gameobjects/Card";
import {MovingColumn} from "./gameobjects/MovingColumn";
import * as PIXI from "pixi.js";
import { convertCompilerOptionsFromJson } from 'typescript';

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
  private _sprites:Map<string,PIXI.DisplayObject>;

  public constructor() {
    this._renderer = new Renderer();
    this._dataResources = [];
    this._sprites = new Map<string,PIXI.Sprite>();     

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
    this._dataResources.forEach((data)=>{
      let texture = this._loader.resources[data.name]?.texture;
      // Create Sprites
      if (texture){
        this._sprites.set(data.name, new PIXI.Sprite(texture));
      }
    })

    // Stage All
    this._sprites.forEach((sprite)=>this._renderer.addToStage(sprite));

    // Start Game Loop
    // In order to use the gameLoop callback, we must pass through
    // all of the game objects created by this function.
    if(startGameLoop){
      this._renderer.loop(this.gameLoop,this._sprites);
    }
  }

  // Game Logic and state management
  gameLoop(delta:number,gameObjects:Map<string,PIXI.DisplayObject>){
    //logic here:
  }

}