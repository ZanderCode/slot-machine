import { Renderer } from './renderer/renderer';

export class App {
  private _renderer: Renderer;

  public constructor() {
    this._renderer = new Renderer();
    this.getAssets();
  }

  async getAssets(){
    this._renderer.loadAssets(
      "test.png",
      "test1.png",
    );
  }
}
