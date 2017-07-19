import S from "./s";
import React from "react";
import MLModel from "./mlmodel";

class Node{
	constructor(data, layer){
		this.data = data;
		this.layer = layer;
		this.isLeaf = true;
		this.feature = null;
		this.splitVal = null;
		this.children = [];
	}
	calculateEntropy(){
		if (this.isLeaf){
			var counts = [0, 0];
			for (var i = 0; i < this.data.length; i ++){
				
			}
		}
		else
			return this.children[0].calculateEntropy * this.children[0].data.length / this.data.length
				+ this.children[1].calculateEntropy * this.children[1].data.length / this.data.length;
	}
}

export default class Tree extends MLModel {
	constructor(){
		super();
		this.tree = null;
		this.maxDepth = 5;
	}
	classif(x, y){
		var result = this.w[0] * x + this.w[1] * y + this.w[2];
		return this.pr2cl(result);
	}
	maxIndex(arr){
		var bestIndex = -1;
		var bestVar = -Infinity;
		for (var i = 0; i < arr.length; i ++){
			if(arr[i] > bestVar){
				bestVar = arr[i];
				bestIndex = i;
			}
		}
		return bestIndex;
	}
	dist(x1, y1, x2, y2){
		return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	}
	train(){

	}
	setMaxIters(iters){
		if(iters < 100){
			this.maxIters = iters;
			return true;
		}
		return false;
	}
	uiInstance(){
		var self = this;
		var setMaxIters = this.setMaxIters.bind(this);
		return(
			class PerceptronUI extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						maxIters: self.maxIters
					};
					this.onChange = this.onChange.bind(this);
				}
				onChange(e){
					if(setMaxIters(e.target.value)) {
						this.setState({
							maxIters: e.target.value
						});
					}
				}
				render(){
					return(
						<div>
							Max Iters: <input type = "text" value = {this.state.maxIters} onChange = {this.onChange}/>
						</div>
					);
				}
			}
		);
	}
	info(){
		return this.generateInfo(
			"Decision Tree",
			"If computers played 21 questions.",
			<div>Design a tree that tries to put data into buckets, using certain thresholds on features</div>,
			["Max depth (\u2264 10): Maximum number of updates for training"],
			["Binary Classification", "Regression"],
			["One of the oldest algorithms out there - cause it's a very simple one. In mathematical terms, we simply solve for a linear combination of the inputs (ie. h = ax + by + cz..., where x, y, z are inputs and a, b, c are constants), then use this output h to predict - positive h for Class A , negative h for Class B. In an intuitive sense, we're finding a straight boundary that exactly cuts through the data.",
				"It's easy to visualize it as a line if the data is two-dimensional - as in our case. In three dimensions, it's a plane. In four dimensions, it's an entire 3d space - not so easy to visualize anymore.",
				"The history behind the perceptron is quite an interesting one. Soon after its invention by Rosenblatt in 1957, it was hyped up to be the \"next big thing\" - the New York Times, for example, reported that the perceptron \"will be able to walk, talk, see, write, reproduce itself and be conscious of its existence.\"", 
				"However, it became rather clear that it could achieve non of these feats - it couldn't even recognize a circle, for example (try it!). This led to an abrupt end in perceptron research in 1969 - what we now call one of several \"AI winters\". Perhaps this serves as a cautionary tale for our own golden age of Machine Learning..."],
			["Simple to implement", "Tiny, tiny model (boils down to small list of numbers!)"],
			["Assumes linearly separable data - does poorly otherwise",
				"Can end up with bad fits with points right on the 'edge'"]
		);
	}
}