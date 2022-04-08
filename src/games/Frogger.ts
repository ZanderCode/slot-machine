import {SlotMachine, SlotStates} from "../gameobjects/SlotMachine";
import {GameObject, AXIS} from "../gameobjects/GameObject";
import {Slot, SlotState} from "../gameobjects/Slot";
import {Renderer} from '../renderer/renderer';
import {Lever} from '../gameobjects/Lever';
import { Frog } from "./froggerlogic/Frog";
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
export class Frogger{

  private static SLOT_MACHINE = "SlotMachine";
  private static VISIBLE_SYMBOLS:number = 4;
  private static LEVER_POSITION_FACTOR = 6;
  private static SLOT_1:string = "SLOT1";
  private static SLOT_2:string = "SLOT2";
  private static SLOT_3:string = "SLOT3";
  private static SLOT_4:string = "SLOT4";
  private static SLOT_5:string = "SLOT5";
  private static LEVER:string = "Lever";
  private static FROG:string = "Frog";
  private static SPEED:number = 15;
  private static SIZE:number = 100;
  private static ASSET_PATH = "/assets/" 
  
  private static WATER_RES:string = "water";
  private static LILLY_RES:string = "lily";
  private static ROCK_RES:string = "rock";

  private _renderer: Renderer;
  private _loader:PIXI.Loader;

  // Data and [GameObject]s that are loaded into our application.
  private _loadedTextures:Map<string,PIXI.Texture> = new Map<string,PIXI.Texture>();
  private _gameObjects:Map<string,GameObject>;

  public constructor(canvas:HTMLCanvasElement) {
    
    this._gameObjects = new Map<string,GameObject>();     
    this._renderer = new Renderer(canvas,Frogger.VISIBLE_SYMBOLS*Frogger.SIZE);

    // Load Assets
    this._loader = new PIXI.Loader(Frogger.ASSET_PATH);
    this.addDataResource(Frogger.WATER_RES,"water.png");
    this.addDataResource(Frogger.ROCK_RES,"rock.png");
    this.addDataResource(Frogger.LILLY_RES,"lilly.png");
    this.addDataResource(Frogger.FROG,"phrog.png");

    // We can't start the game until all assets are loaded.
    this._loader.onComplete.add(()=>{
      this.createGameObjects(true);
    });
    this._loader.load();
  }

  // Adds a new resource to the loader
  addDataResource(name:string,path:string){
    let res = new DataResource(name,path);
    this._loader.add(res.name,res.path);
  }

  // All assets have been loaded, create [GameObjects] from them
  createGameObjects(startGameLoop:boolean=false){
    
    // Grab the textures from the resources
    let water = this._loader.resources[Frogger.WATER_RES].texture;
    let rock = this._loader.resources[Frogger.ROCK_RES].texture;
    let lilly = this._loader.resources[Frogger.LILLY_RES].texture;
    let frog = this._loader.resources[Frogger.FROG].texture;
    this._loadedTextures.set(Frogger.WATER_RES,water);
    this._loadedTextures.set(Frogger.ROCK_RES,rock);
    this._loadedTextures.set(Frogger.LILLY_RES,lilly);

    let leverRadius = Frogger.SIZE/2;
    let leverX = Frogger.SIZE*Frogger.LEVER_POSITION_FACTOR+leverRadius;
    let leverH = (Frogger.SIZE*Frogger.VISIBLE_SYMBOLS)-(leverRadius*2);
    let leverY = leverRadius;
    let leverW = leverRadius;

    let slot1 = new Slot([water,rock,lilly,lilly,lilly],Frogger.VISIBLE_SYMBOLS,Frogger.SIZE,AXIS.Vertical,Frogger.SPEED)
    let slot2 = new Slot([water,rock,lilly,lilly,lilly],Frogger.VISIBLE_SYMBOLS,Frogger.SIZE,AXIS.Vertical,Frogger.SPEED)
    let slot3 = new Slot([water,rock,lilly,lilly,lilly],Frogger.VISIBLE_SYMBOLS,Frogger.SIZE,AXIS.Vertical,Frogger.SPEED)
    let slot4 = new Slot([water,rock,lilly,lilly,lilly],Frogger.VISIBLE_SYMBOLS,Frogger.SIZE,AXIS.Vertical,Frogger.SPEED)
    let slot5 = new Slot([water,rock,lilly,lilly,lilly],Frogger.VISIBLE_SYMBOLS,Frogger.SIZE,AXIS.Vertical,Frogger.SPEED)
    let lever = new Lever(leverX,leverY,leverW,leverH);
    let slot = new SlotMachine(lever,[slot1,slot2,slot3,slot4,slot5],AXIS.Vertical);
    let frogObj:Frog = new Frog(frog,Frogger.SIZE);

    lever.addActivateBehavior(async ()=>{
      await slot.start();
      await slot.stop();
    });
    
    this._gameObjects.set(Frogger.SLOT_MACHINE, slot);
    this._gameObjects.set(Frogger.SLOT_1,slot1);
    this._gameObjects.set(Frogger.SLOT_2,slot2);
    this._gameObjects.set(Frogger.SLOT_3,slot3);
    this._gameObjects.set(Frogger.SLOT_4,slot4);
    this._gameObjects.set(Frogger.SLOT_5,slot5);
    this._gameObjects.set(Frogger.LEVER,lever);   
    this._gameObjects.set(Frogger.FROG,frogObj);

    this._gameObjects.forEach((go)=>{
      this._renderer.addToStage(go.getRenderable())
    });
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

    let slotMachine = gameObjects.get(Frogger.SLOT_MACHINE) as SlotMachine;
    if (slotMachine.slotState === SlotStates.PRIZE){
      
      // Slots can still move into place after being stopped. TODO: fix this later. Not enough time.
      if ((gameObjects.get(Frogger.SLOT_1) as Slot).state == SlotState.STOPPED && 
          (gameObjects.get(Frogger.SLOT_2) as Slot).state == SlotState.STOPPED &&
          (gameObjects.get(Frogger.SLOT_3) as Slot).state == SlotState.STOPPED &&
          (gameObjects.get(Frogger.SLOT_4) as Slot).state == SlotState.STOPPED && 
          (gameObjects.get(Frogger.SLOT_5) as Slot).state == SlotState.STOPPED) {

        // What happens when the slots finally stopped?
        // Lets check the results and change state back to IDLE
        slotMachine.slotState = SlotStates.IDLE;
        let spriteMatrix:Array<PIXI.Sprite[]> = slotMachine.getResult();
        //console.log(spriteMatrix);

        // Frog must search for a path to traverse.
        let frog = gameObjects.get(Frogger.FROG) as Frog;
        frog.followPath(spriteMatrix,textures.get(Frogger.LILLY_RES)).then((success)=>{
          //calculate prize
          if (success){
            console.log("FROG BONUS!");
          }else{
            console.log("NO FROG BONUS!")
          }
        });
      }
    }
  }
}