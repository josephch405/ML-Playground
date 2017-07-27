import S from "./s";
import React from "react";
import MLModel from "./mlmodel";

class Node {
	// data: [[[x, y], [x, y]....], [1, 0, 0, 1, 1,...]]
	constructor(data, layer) {
		this.data = data;
		this.layer = layer;
		this.isLeaf = true;
		this.pred = null;
		this.feature = null;
		this.splitVal = null;
		this.children = [];
	}
	fire(xTr) {
		if (this.isLeaf)
			return this.pred;
		if (xTr[this.feature] <= this.splitVal)
			return this.children[0].fire(xTr);
		return this.children[1].fire(xTr);
	}
	train(layersLeft) {
		if (layersLeft <= 0 || this.homogenous(this.data[1])) {
			this.pred = this.majorityLabel(this.data[1]);
			this.isLeaf = true;
			return;
		}
		var bestSplit = this.bestSplit(this.data);

		this.isLeaf = false;
		this.feature = bestSplit.feature;
		this.splitVal = bestSplit.value;

		this.children[0] = new Node(bestSplit.left, this.layer + 1);
		this.children[1] = new Node(bestSplit.right, this.layer + 1);

		this.children[0].train(layersLeft - 1);
		this.children[1].train(layersLeft - 1);
	}
	homogenous(arr) {
		var poten = arr[0];
		for (var i = 1; i < arr.length; i++) {
			if (arr[i] != poten)
				return false
		}
		return true;
	}
	majorityLabel(arr) {
		var counter = [0, 0];
		arr.forEach((entry) => {
			if (entry == S.class1)
				counter[0] += 1;
			else
				counter[1] += 1;
		});
		return counter[0] > counter[1] ? S.class1 : S.class2;
	}
	// ONLY yTr
	gini(arr) {
		var counter = [0, 0];
		arr.forEach((entry) => {
			if (entry == S.class1)
				counter[0] += 1;
			else
				counter[1] += 1;
		});
		var p = counter[0] / (counter[0] + counter[1]);
		return p * (1 - p);
	}
	// split by going from 0 -> split - 1 vs split -> end
	// ONLY yTr
	entropyAtSplit(arr, split) {
		var arr1 = arr.slice(0, split);
		var arr2 = arr.slice(split, arr.length);
		return arr1.length * this.gini(arr1) + arr2.length * this.gini(arr2);
	}
	bestSplit(data) {
		var xTr = data[0];
		var yTr = data[1];
		var bestFeature = -1;
		var bestSplitIndex;
		var bestEntropy = Infinity;
		for (var f = 0; f < 2; f++) {
			var sortedData = this.sortByX(data, f);
			for (var i = 1; i < sortedData[0].length; i++) {
				var _e = this.entropyAtSplit(sortedData[1], i);
				if (_e < bestEntropy) {
					bestEntropy = _e;
					bestSplitIndex = i;
					bestFeature = f;
				}
			}
		}
		var sortedData = this.sortByX(data, bestFeature);
		xTr = sortedData[0];
		yTr = sortedData[1];
		console.log("xTr", xTr);
		console.log("bestSplit", bestSplitIndex);
		return {
			feature: bestFeature,
			value: (xTr[bestSplitIndex - 1][bestFeature] + xTr[bestSplitIndex][bestFeature]) / 2,
			left: [xTr.slice(0, bestSplitIndex), yTr.slice(0, bestSplitIndex)],
			right: [xTr.slice(bestSplitIndex, xTr.length), yTr.slice(bestSplitIndex, yTr.length)]
		};
	}
	sortByX(data, feature) {
		var xTr = data[0];
		var yTr = data[1];
		var concatted = xTr.map((val, ind) => [...val, yTr[ind]]);
		concatted.sort((a, b) => a[feature] - b[feature]);
		var xTrNew = concatted.map((val) => [val[0], val[1]]);
		var yTrNew = concatted.map((val) => val[2]);
		return [xTrNew, yTrNew];
	}
}

export default class Tree extends MLModel {
	constructor() {
		super();
		this.root = null;
		this.maxDepth = 5;
	}
	classif(x, y) {
		return this.root.fire([x, y]);
	}
	dist(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	}
	train() {
		this.root = new Node([this.xTr, this.yTr], 0);
		this.root.train(this.maxDepth);
	}
	setMaxDepth(val){
		if(val >= 0 && val <= 100){
			this.maxDepth = val;
			return true;
		}
		return false;
	}
	uiInstance() {
		var self = this;
		return (
			class TreeUI extends React.Component {
				constructor(props) {
					super(props);
					this.state = {
						maxDepth: self.maxDepth
					};
				}
				onChangeDepth(e){
					if(self.setMaxDepth(e.target.value)){
						this.setState({maxDepth: e.target.value});
					}
				}
				render() {
					return (<div>
							Max Tree Depth: <input type = "text" value = {this.state.maxDepth} onChange = {(e)=>this.onChangeDepth(e)}/>
						</div>);
				}
			}
		);
	}
	info() {
		return this.generateInfo({
			name: "Decision Tree",
			tldr: "If computers played 21 questions",
			expl1: "Design a tree that tries to put data into buckets, using certain thresholds on features",
			params: ["Max depth (\u2264 10): Maximum number of splits for the tree"],
			usecase: ["Binary Classification", "Multi-class Classification", "Regression"],
			expl2: ["Basically flowcharts. You begin at the root node. Based on the value of one feature (or sometimes more), we go to the left or right child of the tree. Et cetera, until we arrive at a leaf node, and then we make a prediction based on that leaf.",
				"It's easy to follow a tree once you've constructed one - it's a very simple chain of 'yes/no's and true/falses. The interesting part is obviously making the tree.",
				"There are various algorithms for making trees out there, but in general all work towards minimizing entropy. Not the physical kind, but the Informational kind. In the context of a decision tree and nodes, entropy is high when points arriving at a node vary a lot in terms of their labels. If we have a tree that buckets equal numbers of orange and purple points together, this tree has high entropy and is bad. Vice versa - if we end up bucketing orange points together, and purple points separately, then there is low entropy, and this is a good tree.",
				"Another key component is the backpropogation algorithm. Because of the network's straightforward structure, we can mathematically find a way to optimize our network. We calculate a 'gradient', which involves calculating derivatives for each individual neuron, and then adjusting all the weights accordingly. We adjust the weights by going back from the last layer to the first - hence 'back propogation' of weight updates.",
				"A lot of cooler applications of Neural Networks revolve around using more complex forms than a simple Dense network (as presented here).",
				"Convolutional Networks (ConvNets) are experts at image processing, as they 'Convolve' across the whole image, ie. scan the image with a smaller moving window.",
				"Recurrent Neural Networks (RNNs) are powerful for data generation, both for images and text, because of their power to 'remember' data from previous entries in a time series."
			],
			pros: ["Universal Approximator - any continuous function can be approximated by a finite amount of neurons in one layer. No guarantees about learnability though - ie. there's a good fit out there, but it's kinda on you to find it. Somehow.",
				"As stated, very effective at certain problems such as visual or linguistic problems."
			],
			cons: ["Bulky - training can take a bit of time, and the number of layers people are training these days are sort of ridiculous",
				"Mysterious - in some ways, we're not entirely sure why they're so effective, especially within certain fields such as Vision."
			],
			links: [
				<a target = "_blank" href = "https://en.wikipedia.org/wiki/Artificial_neural_network">Wikipedia: Artificial neural network</a>,
				<a target = "_blank" href = "http://cs231n.github.io/optimization-2/">Intuitions on backpropogation (Stanford CS 231n, Karpathy)</a>,
				<a target = "_blank" href = "https://ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/">Intuitive explanation of ConvNets (Karn)</a>,
				<a target = "_blank" href = "http://karpathy.github.io/2015/05/21/rnn-effectiveness/">The Unreasonable Effectiveness of Recurrent Neural Networks (Karpathy)</a>
			]
		});
	}
}