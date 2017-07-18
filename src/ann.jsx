import S from "./s";
import React from "react";
import {default as m} from "mathjs";
import MLModel from "./mlmodel";

const norm = 100;
const MAX_PER_LAYER = 10;
const MAX_LAYERS = 8;


export default class Ann extends MLModel{
	constructor(){
		super();
		this.layers = [2, 4, 4, 1];
		this.shuffleWeights();
		this.classif = this.classif.bind(this);
	}
	shuffleWeights(){
		this.A = [];
		this.b = [];
		for (var i = 0; i < this.layers.length - 1; i ++){
			this.A[i] = m.matrix(m.random([this.layers[i + 1], this.layers[i]], -.5, .5));
			this.b[i] = m.matrix(m.random([1, this.layers[i + 1]], -.2, .2).valueOf()[0]);
		}
	}
	relu(input){
		input.resize([input.size()[0], 2], 0);
		return m.max(input, 1);
	}
	tanh(input){
		return m.tanh(input);
	}
	classif(x, y){
		var z = [[x/norm, y/norm], 0, 0];
		var ax = [0, 0];
		for(var i = 0; i < this.layers.length - 1; i ++){
			ax[i] = m.add(m.multiply(this.A[i], z[i]), this.b[i]);
			z[i + 1] = this.tanh(ax[i]);
		}
		return this.pr2cl(z[this.layers.length - 1].valueOf()[0]);
	}
	vvMult(v1, v2){
		v1 = m.transpose(m.matrix([v1]));
		v2 = m.matrix([v2]);
		var ret = m.multiply(v1, v2);
		if (typeof ret == "number")
			return m.matrix([[ret]]);
		if (ret.size().length == 1)
			return m.matrix([ret]);
		return ret;
	}
	shuffle(a, b) {
		for (let i = a.length; i; i--) {
			let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
			[b[i - 1], b[j]] = [b[j], b[i - 1]];
		}
	}
	train(){
		this.shuffleWeights();

		var alpha = 0.015;
		var self = this;
		var yTr = this.yTr.map(function(i){
			return self.cl2pr(i);
		});
		var xTr = this.xTr.map(function(i){
			return m.divide(i.slice(), norm);
		});
		//var g = [0, 0];
		var err = 0;
		for(var i = 0; i < 2000; i ++){
			err = 0;
			this.shuffle(xTr, yTr);
			var _A = m.clone(this.A);
			var _b = m.clone(this.b);
			for(var ii = 0; ii < xTr.length; ii ++){
				var z = [0, 0, 0];
				var ax = [0, 0];

				z[0] = [xTr[ii][0], xTr[ii][1]];
					
				for(var j = 0; j < this.layers.length - 1; j ++){
					ax[j] = m.squeeze(m.add(m.squeeze(m.multiply(this.A[j], z[j])), this.b[j]));
					z[j + 1] = this.tanh(ax[j]);
				}
				

				var delta = [0, 0];
				var lmax = this.layers.length;
				var diff = z[lmax - 1] - yTr[ii];

				delta[lmax - 2] = m.multiply(diff, m.subtract(1, m.square(z[lmax - 1])));
				err += Math.abs(diff);

				for(var l = lmax - 2; l >= 0; l--){
					_A[l] = m.subtract(_A[l], m.chain(alpha).multiply(this.vvMult(delta[l], z[l])).done());
					_b[l] = m.subtract(_b[l], m.squeeze(m.multiply(alpha, delta[l])));
					if(l != 0){
						var der = m.subtract(1, m.square(z[l]));
						var tpDelt = m.squeeze(m.multiply(m.transpose(this.A[l]), delta[l]));
						var d = m.dotMultiply(der, tpDelt);
						delta[l - 1] = d;
					}
				}

			}
			this.A = _A;
			this.b = _b;
			err /= xTr.length;
			console.log("ANN error: ", err);
			if(err < 0.05){
				break;
			}
			//alpha *= .95
		}
		return;
	}
	pr2cl(pr){
		if (pr > 0)
			return S.class1;
		return S.class2;
	}
	cl2pr(cl){
		if(cl == S.class1)
			return 1;
		return -1;
	}
	addNeuron(layer){
		console.log(layer)
		if (layer && layer > 0 && layer < this.layers.length - 1 && this.layers[layer] < MAX_PER_LAYER){
			this.layers[layer] += 1;
		}
		return this.layers;
	}
	removeNeuron(layer){
		if (layer && layer > 0 && layer < this.layers.length - 1 && this.layers[layer] > 1){
			this.layers[layer] -= 1;
		}
		return this.layers;
	}
	addLayer(){
		if(this.layers.length - 2 < MAX_LAYERS){
			this.layers.push(1);
			this.layers[this.layers.length - 2] = 3;
		}
		return this.layers;
	}
	removeLayer(){
		if(this.layers.length > 3){
			this.layers.splice(this.layers.length - 1, 1);
			this.layers[this.layers.length - 1] = 1;
		}
		return this.layers;
	}
	uiInstance(){
		//var setK = this.setK.bind(this);//this.setK.bind(this);
		var self = this;
		return(
			class PerceptronUI extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						layers: self.layers
					};
				}
				dispatch(type, n){
					switch(type){
					case "n+":
						this.setState({layers: self.addNeuron(n)});
						break;
					case "n-":
						this.setState({layers: self.removeNeuron(n)});
						break;
					case "l+":
						this.setState({layers: self.addLayer()});
						break;
					case "l-":
						this.setState({layers: self.removeLayer()});
						break;
					}
					console.log(self.layers)
				}
				createDispatch(type, n){
					return () => {this.dispatch(type, n)};
				}

				render(){
					var layers = [];
					//first input layer
					layers.push(<div key = {0} className = "layer">
							<button>X</button>
							<button>Y</button>
						</div>);
					//middle layers
					for(var i = 1; i < self.layers.length - 1; i ++){
						var layer = [];
						var l = i;
						for(var ii = 0; ii < self.layers[i]; ii ++){
							layer.push(<button onClick = {this.createDispatch("n-", l)}></button>);
						}
						layer.push(<button className = "flipped" onClick = {this.createDispatch("n+", l)}>+</button>);
						layers.push(<div key = {i} className = "layer">
							{layer}
						</div>);
					}
					//last layer
					layers.push(<div key = {self.layers.length - 1} className = "layer">
							<button></button>
						</div>);
					layers.push(<div key = {self.layers.length} className = "layer">
						Layers:
							<button className = "flipped" onClick = {this.createDispatch("l+")}>+</button>
							<button className = "flipped" onClick = {this.createDispatch("l-")}>-</button>
						</div>);
					var annContainer = <div id = "ANN-panel">{layers}</div>;
					return(
						<div>
							Click on neurons to remove<br/>
							{annContainer}
							Non yet
						</div>
					);
				}
			}
		);
	}
	info(){
		return this.generateInfo({
			name: "Artificial Neural Network",
			tldr: "Perceptrons! More Perceptrons!",
			expl1: "Chain a lot of perceptrons together, in layers. Forward-propogate to solve for a prediction. Train by using backpropogation and updating weights of the neurons.",
			params: ["Layers and neurons - just keep it reasonable! Don't train a 1000 layers each with 1000 neurons - you'll shoot your eye out."],
			usecase: ["Binary Classification", "Multi-class Classification","Regression"],
			expl2: ["The hottest thing out there (note: written in 2017). Who knows how long this trend will go on for.",
				"The basic premise is that you have multiple layers of perceptrons. Each layer takes in input from the last, and each neuron outputs one number - ie. 'fires'. We then apply some activation function to this 'fired' output, and then we move onto the next layer.",
				"The activation function is crucial in this - if you didn't push outputs through an activation function, you're effectively training a simple perceptron. In other words, activation functions are what gives Neural Networks their magic. In this case, we use a tanh activation function that scales outputs between -1 to 1 - a variety of others are used, such as Rectified Linear Units (ReLU) and the logistic function.",
				"Another key component is the backpropogation algorithm. Because of the network's straightforward structure, we can mathematically find a way to optimize our network. We calculate a 'gradient', which involves calculating derivatives for each individual neuron, and then adjusting all the weights accordingly. We adjust the weights by going back from the last layer to the first - hence 'back propogation' of weight updates.",
				"A lot of cooler applications of Neural Networks revolve around using more complex forms than a simple Dense network (as presented here).",
				"Convolutional Networks (ConvNets) are experts at image processing, as they 'Convolve' across the whole image, ie. scan the image with a smaller moving window.", 
				"Recurrent Neural Networks (RNNs) are powerful for data generation, both for images and text, because of their power to 'remember' data from previous entries in a time series."],
			pros: ["Universal Approximator - any continuous function can be approximated by a finite amount of neurons in one layer. No guarantees about learnability though - ie. there's a good fit out there, but it's kinda on you to find it. Somehow.",
				"As stated, very effective at certain problems such as visual or linguistic problems."],
			cons: ["Bulky - training can take a bit of time, and the number of layers people are training these days are sort of ridiculous", 
				"Mysterious - in some ways, we're not entirely sure why they're so effective, especially within certain fields such as Vision."],
			links: [
				<a target = "_blank" href = "https://en.wikipedia.org/wiki/Artificial_neural_network">Wikipedia: Artificial neural network</a>,
				<a target = "_blank" href = "http://cs231n.github.io/optimization-2/">Intuitions on backpropogation (Stanford CS 231n, Karpathy)</a>,
				<a target = "_blank" href = "https://ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/">Intuitive explanation of ConvNets (Karn)</a>,
				<a target = "_blank" href = "http://karpathy.github.io/2015/05/21/rnn-effectiveness/">The Unreasonable Effectiveness of Recurrent Neural Networks (Karpathy)</a>
			]
		});
	}
}