import "./main.less";

//import * as css from "main.less";

import React from "react";
import ReactDOM from "react-dom";

import UI from "./ui";
import Store from "./store";
import Knn from "./knn";
import Perceptron from "./perceptron";
import Canvas from "./canvas";

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

ctx.canvas.width = 400;
ctx.canvas.height = 400;

const canvas = new Canvas(c);
const store = new Store();
//const knn = new Knn();
const classif = new Perceptron();
canvas.linkToStore(store);
//store.linkClassif(knn);
store.linkClassif(classif);



ReactDOM.render(
    <UI setClass = {(brush) => {canvas.setBrush(brush);}} 
        train = {() => {canvas.trainAndClassif();}}
        modelUI = {classif.uiInstance()} />,
    document.getElementById("options")
);

c.addEventListener("click", (evt)=>{canvas.onPointAdded(evt);}, false);

/*
function writeMessage(context, message) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 25);
}

function drawCursor(context, mousePos) {
    context.clearRect(0, 0, canvas.width, canvas.height);
	var radius = 6;
    context.beginPath();
    context.arc(mousePos.x, mousePos.y, radius, 0, 2 * Math.PI, false);
    //context.fillStyle = "#00000000";
    //context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#003300";
    context.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

c.addEventListener("mousemove", function(evt) {
    var mousePos = getMousePos(c, evt);
    drawCursor(ctx, mousePos);
}, false);

c.addEventListener("click", function(evt) {
    var mousePos = getMousePos(c, evt);
    var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
    writeMessage(ctx, message);
}, false)
*/