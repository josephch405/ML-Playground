import "./main.less";

//import * as css from "main.less";

import React from "react";
import ReactDOM from "react-dom";

import UI from "./ui";

import Store from "./store";
import Canvas from "./canvas";
import S from "./s";

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

ctx.canvas.width = S.canvasW;
ctx.canvas.height = S.canvasH;

const canvas = new Canvas(c);
const store = new Store();
canvas.linkToStore(store);

const steps = [{
	title: "Populate the Canvas",
	text: "Click to add data points",
	selector: "#canvas",
	position: "right ",
	isFixed: false
}, {
	title: "Select Data type",
	text: "You get two colors, or classes, to chose from. Select x to begin Eraser Mode.",
	selector: "#brushes > div",
	position: "bottom",
	isFixed: false
}, {
	title: "Select Model",
	text: "Swap between different models. Try them all out! Your data and predictions don't change until you retrain.",
	selector: "#model-selector",
	position: "right",
	isFixed: false
}, {
	title: "Tune parameters",
	text: "You can change some settings of each model.",
	selector: "#parameters",
	position: "left",
	isFixed: false
}, {
	title: "Train and fire!",
	text: "Click to train your model! Note that some models can take time to train (sometimes up to 10-20 seconds). If the button remains black, chances are it's still training.",
	selector: "#trainAndDisplay",
	position: "left",
	isFixed: false
}, {
	title: "Read and learn",
	text: "Contains details about how the algorithm is run. Try and follow the guides to test effectiveness of certain models on certain datasets.",
	selector: "#infoPanel",
	position: "top",
	isFixed: false
}, {
	title: "That's all!",
	text: "Have fun! Leave some feedback if you thought this was cool.",
	selector: "#feedback",
	position: "top",
	isFixed: true
}];

var renderInfo = (info) => {
	ReactDOM.render(
		info,
		document.getElementById("infoPanel")
	);
};

import Joyride from "react-joyride";

class JoyrideWrapper extends React.Component {

	render(){
		return (
			<Joyride
				ref="joyride"
				steps={steps}
				run={true}
				debug={false}
				showSkipButton={true}
				type={"continuous"}
				showStepsProgress={true}
				callback={this.callback}
				allowClicksThruHole={true}
				scrollToSteps={false}
				autoStart={true}
				showOverlay={false}
			/>
		);
	}
}

var renderJoyride = () => {
	ReactDOM.render(
		<JoyrideWrapper/>,
		document.getElementById("joyride-panel")
	);
};


ReactDOM.render(
	<UI setClass = {(brush) => {canvas.setBrush(brush);}}
		train = {() => {canvas.trainAndClassif();}}
		store = {store}
		renderInfo = {renderInfo}
	clearAll = {()=>{canvas.clearAll()}} />,
	document.getElementById("options")
);

renderJoyride();

c.addEventListener("click", (evt)=>{canvas.onPointAdded(evt);}, false);