import "./main.less";

//import * as css from "main.less";

import React from "react";
import ReactDOM from "react-dom";

import UI from "./ui";
import Store from "./store";
import Canvas from "./canvas";

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

ctx.canvas.width = 400;
ctx.canvas.height = 400;

const canvas = new Canvas(c);
const store = new Store();
canvas.linkToStore(store);

ReactDOM.render(
	<UI setClass = {(brush) => {canvas.setBrush(brush);}}
		train = {() => {canvas.trainAndClassif();}}
		store = {store} />,
	document.getElementById("options")
);

c.addEventListener("click", (evt)=>{canvas.onPointAdded(evt);}, false);