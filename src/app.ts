import { Renderer } from './renderer/renderer';

export class App {
  private _renderer: Renderer;

  public constructor() {
    this._renderer = new Renderer();
    this._renderer.loadAssets(
      "test.png",
      "test1.png",
    );
    this._renderer.loadAssetsAndGame(this._loop)
  }



  private _loop(){

  }
}
