import { Renderer } from './renderer/renderer';

export class App {
  private _renderer: Renderer;

  public constructor() {
    this._renderer = new Renderer();
  }
}
