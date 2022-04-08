import {GameObject, AXIS} from "../gameobjects/GameObject";
import {SlotMachine, SlotStates} from "../gameobjects/SlotMachine";
import {Renderer} from '../renderer/renderer';
import {Lever} from '../gameobjects/Lever';
import {Slot, SlotState} from "../gameobjects/Slot";
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
export class Classic{
  private _renderer: Renderer;
  private _loader:PIXI.Loader;

  //_sprite:string refers to _dataResources.name
  private _dataResources:DataResource[];
  private _gameObjects:Map<string,GameObject>;
  private _loadedTextures:Map<string,PIXI.Texture> = new Map<string,PIXI.Texture>();

  private static SPEED:number = 10;

  public constructor(canvas:HTMLCanvasElement) {
    this._renderer = new Renderer(canvas);
    this._dataResources = [];
    this._gameObjects = new Map<string,GameObject>();     

    // Load Assets, Create Game Objects
    this._loader = new PIXI.Loader("assets/");
    this.addDataResource("7","7.png");
    this.addDataResource("grape","grape.png");
    this.addDataResource("star","star.png");
    this.addDataResource("watermelon","watermelon.png");
    this.addDataResource("bar","bar.png");

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
    let sevenName = this._dataResources[0].name;
    let barName = this._dataResources[1].name;
    let grapeName = this._dataResources[2].name;
    let starName = this._dataResources[3].name;
    let watermelonName = this._dataResources[4].name;
    // Grab the textures from the resources
    let seven = this._loader.resources[sevenName].texture;
    let bar = this._loader.resources[barName].texture;
    let grape = this._loader.resources[grapeName].texture;
    let star = this._loader.resources[starName].texture;
    let watermelon = this._loader.resources[watermelonName].texture;

    this._loadedTextures.set(sevenName,seven);
    this._loadedTextures.set(barName,bar);
    this._loadedTextures.set(grapeName,grape);
    this._loadedTextures.set(starName,star);
    this._loadedTextures.set(watermelonName,watermelon);

    // Create [Slot]s
    let size:number = 100;
    let slots:Slot[] = [];
    let amountOfSlots:number = 3;
    for(let i=0;i<amountOfSlots;i++){
      slots.push(new Slot([seven,bar,grape,star,watermelon],3,size,AXIS.Horizontal,Classic.SPEED));
    }   
     
    let leverRadius = size/2;
    let lever = new Lever(size*4+leverRadius,leverRadius,leverRadius,(size*3)-(leverRadius*2));

    // For testing purposes
    let col1Target:PIXI.Texture[] = [bar,seven,watermelon,star,bar];
    let col2Target:PIXI.Texture[] = [grape,seven,bar,grape,bar];
    let col3Target:PIXI.Texture[] = [watermelon,seven,star,seven,grape];
    let colTargs:Array<PIXI.Texture[]> = [col1Target,col2Target,col3Target]

    let slot = new SlotMachine(lever,[...slots],AXIS.Horizontal,colTargs);
    
    lever.addActivateBehavior(async ()=>{
      await slot.start();
      await slot.stop();
    });
    
    this._gameObjects.set("SlotMachine", slot);
    for(let i=0;i<amountOfSlots;i++){
      this._gameObjects.set("Slot"+i.toString(),slots[i]);
    }
    this._gameObjects.set("Lever",lever);   
    this._gameObjects.forEach((go)=>this._renderer.addToStage(go.getRenderable()));

    // Start Game Loop
    // In order to use the gameLoop callback, we must pass through
    // all of the game objects created by this function.
    if(startGameLoop){
      this._renderer.loop(this.gameLoop,this._gameObjects,this._loadedTextures);
    }
  }

  // Game Logic and state management
  // States = Idle, Rolling, Stopping, Prize
  gameLoop(delta:number,gameObjects:Map<string,GameObject>,textures:Map<string,PIXI.Texture>){
  
    
    gameObjects.forEach(go => {
      go.frame(delta);
    });


    let slotMachine = gameObjects.get("SlotMachine") as SlotMachine;
    if (slotMachine.slotState === SlotStates.PRIZE){
      
      // Slots can still move into place after being stopped. TODO: fix this later. Not enough time.
      if ((gameObjects.get("Slot0") as Slot).state == SlotState.STOPPED && 
          (gameObjects.get("Slot1") as Slot).state == SlotState.STOPPED &&
          (gameObjects.get("Slot2") as Slot).state == SlotState.STOPPED) {

        // What happens when the slots finally stopped?
        // Lets check the results and change state back to IDLE
        slotMachine.slotState = SlotStates.IDLE;
        let spriteMatrix:Array<PIXI.Sprite[]> = slotMachine.getResult();

        // Do something with result
      }
    }
  }
}