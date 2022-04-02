import * as PIXI from 'pixi.js';

export class Renderer {
  private _application: PIXI.Application;

  public constructor() {
    this._application = new PIXI.Application({
      backgroundColor: 0x000000,
      autoStart: true,
    });

    document.body.appendChild(this._application.view);
  }
  // Below shall serve as functions to render information into the application.
}

export default Renderer;
