import {FroggerType} from "./prizetables/froggertable/frogger";
import {GameObject, AXIS} from "./gameobjects/GameObject";
import {SlotMachine} from "./gameobjects/SlotMachine";
import {Renderer} from './renderer/renderer';
import {Symbol} from "./gameobjects/Symbol"
import {Lever} from './gameobjects/Lever';
import {Slot} from "./gameobjects/Slot";
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
export class App{
  private _renderer: Renderer;
  private _loader:PIXI.Loader;

  //_sprite:string refers to _dataResources.name
  private _dataResources:DataResource[];
  private _gameObjects:Map<string,GameObject>;

  private static SPEED:number = 10;

  public constructor() {
    this._renderer = new Renderer();
    this._dataResources = [];
    this._gameObjects = new Map<string,GameObject>();     

    // Load Assets, Create Game Objects
    this._loader = PIXI.Loader.shared;
    this._loader.baseUrl = "assets/";
    this.addDataResource("water","water.png");
    this.addDataResource("rock","rock.png");
    this.addDataResource("lilly","lilly.png");

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
    
    // Create [GameObject]s and other renderables.
    let waterTextureName = this._dataResources[0].name;
    let rockTextureName = this._dataResources[1].name;
    let lillyPadTextureName = this._dataResources[2].name;
    // Grab the textures from the resources
    let water = this._loader.resources[waterTextureName].texture;
    let rock = this._loader.resources[rockTextureName].texture;
    let lilly = this._loader.resources[lillyPadTextureName].texture;
    // // Create [Symbol]s from the textures.
    // let waterSymbol:Symbol<FroggerType> = new Symbol(water,FroggerType.WATER);
    // let rockSymbol:Symbol<FroggerType> = new Symbol(rock,FroggerType.ROCK);
    // let lillySymbol:Symbol<FroggerType> = new Symbol(lilly,FroggerType.LILLY);



    // Create [Slot]s
    let size:number = 100;
    let slots:Slot[] = [];
    let amountOfSlots:number = 5;
    for(let i=0;i<amountOfSlots;i++){
      slots.push(new Slot([water,rock,lilly],3,size,AXIS.Vertical,App.SPEED));
    }   
     
    let leverRadius = size/2;
    let lever = new Lever(size*6+leverRadius,leverRadius,leverRadius,(size*3)-(leverRadius*2));

    // For testing purposes
    let col1Target:PIXI.Texture[] = [rock,water,water];
    let col2Target:PIXI.Texture[] = [rock,water,water];
    let col3Target:PIXI.Texture[] = [rock,water,water];
    let col4Target:PIXI.Texture[] = [lilly,lilly,lilly];
    let col5Target:PIXI.Texture[] = [rock,water,water];
    let colTargs:Array<PIXI.Texture[]> = [col1Target,col2Target,col3Target,col4Target,col5Target]

    let slot = new SlotMachine(lever,[...slots]);
    
    lever.addActivateBehavior(async ()=>{
      await slot.start(colTargs);
      await slot.stop();
    });
    
    this._gameObjects.set("SlotMachine", slot);
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