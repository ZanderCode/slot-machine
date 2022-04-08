import './index.css';
import { App } from './games/app';
import * as serviceWorker from './serviceWorker';

// Create the skills assessment app
window.onload = () =>{
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
    let canvas3 = document.getElementById("canvas3") as HTMLCanvasElement;
    const app = new App(canvas);
    const app2 = new App(canvas2);
    const app3 = new App(canvas3);
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
