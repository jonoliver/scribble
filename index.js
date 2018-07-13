import React from "react";
import { render } from "react-dom";
import Game from "./js";
import "./scss";
import words from "./js/words.js"
const worker = new Worker('./js/worker.js');

worker.postMessage({ type: 'init', words});

render(<Game {...{worker, words}} />, document.getElementById("app"));
