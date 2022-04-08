import './index.css';
import { Frogger } from './games/Frogger';
import { Classic } from './games/Classic';
import * as serviceWorker from './serviceWorker';

// Create the skills assessment app
window.onload = () =>{
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const froggerApp = new Frogger(canvas);

    let canvas2 = document.getElementById("canvas2") as HTMLCanvasElement;
    const classicApp = new Classic(canvas2);
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
