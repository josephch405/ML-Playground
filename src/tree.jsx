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
	setMaxDepth(val) {
		if (val >= 0 && val <= 100) {
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
				onChangeDepth(e) {
					if (self.setMaxDepth(e.target.value)) {
						this.setState({ maxDepth: e.target.value });
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
			expl1: "Design a tree that tries to put data into buckets, using certain thresholds on features (ie inputs)",
			params: ["Max depth (\u2264 100): Maximum number of splits for the tree"],
			usecase: ["Binary Classification", "Multi-class Classification", "Regression"],
			expl2: ["Basically flowcharts. You begin at the root node. Based on the value of one feature (or sometimes more), we go to the left or right child of the tree. Et cetera, until we arrive at a leaf node, and then we make a prediction based on that leaf.",
				"It's easy to follow a tree once you've constructed one - it's a very simple chain of 'yes/no's and true/falses. The interesting part is obviously making the tree.",
				[<img className = "col-xs-12 col-md-6" src = "./build/img/tree_flow.png"/>,
					<img className = "col-xs-12 col-md-6" src = "./build/img/tree_entropy.png"/>],
				"There are various algorithms for making trees out there, but in general all work towards minimizing entropy. Not the physical kind, but the Informational kind. In the context of a decision tree and nodes, entropy is high when points in a 'bucket' vary a lot in terms of their labels. If we have a tree that buckets equal numbers of orange and purple points together, this tree has high entropy and is bad. Vice versa - if we end up bucketing orange points together, and purple points separately, then there is low entropy, and this is a good tree.",
				"Popular techniques for using trees involves Boosting and Bagging.",
				"Boosting involves training a large number of low-depth (ie high bias) trees that predict just above random chance - then, you intelligently let each small tree contribute towards a final, weighted prediction. This approach primarily lowers the bias of your model.",
				"Bagging involves resampling the dataset - with your training data, we want to generate a new training set that's just a bit different from the original. We do this by randomly picking one out of n points in the original dataset - and we continue this for as many times as we need to form our new 'bag' of training data. Keep in mind the same datapoint is allowed to be picked more than once. This approach tackles variance in your model, and can reduce overfitting.",
				"The cool thing about bagging and boosting is that you usually don't have to worry about tradeoffs - boosting reduces bias without overfitting too much, and bagging reduces variance/overfitting without increasing bias too much. For a lot of machine learning, there's a tradeoff between bias and variance - so this ability to decrease one without significantly affecting the other makes bagging and boosting so powerful.",
				"Note that bagging and boosting are general approaches that don't have to be specific to trees - it's just that trees are more commonly associated with them. You could reduce bias of any algorithm by boosting, and reduce its variance by bagging."
			],
			pros: ["Very easy to implement and interpret"],
			cons: ["Overfits if tree depth is too high",
				"Instable - if data differs by a little bit, the resulting tree can look drastically different, especially if trees have low depth.",
				"Decision boundaries are orthogonal - no drawing 'slanted' lines to separate classes"
			],
			links: [
				["https://en.wikipedia.org/wiki/Decision_tree", "Wikipedia: Decision Tree"],
				["https://en.wikipedia.org/wiki/Bootstrap_aggregating", "Wikipedia: Bootstrap Aggregating (Bagging)"],
				["http://xgboost.readthedocs.io/en/latest/model.html", "Introduction to Boosted Trees (XGBoost, a popular Boosted Tree library)"]
			]
		});
	}
}