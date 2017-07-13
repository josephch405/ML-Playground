import S from "./s";
import React from "react";
import MLModel from "./mlmodel";

export default class Perceptron extends MLModel {
	constructor(){
		super();
		this.w = [0, 0, 0];
		this.maxIters = 20;
	}
	classif(x, y){
		var result = this.w[0] * x + this.w[1] * y + this.w[2] * 100;
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
		this.w = [(Math.random() - .5) * 10, (Math.random() - .5) * 10, 0];
		var allGood = false;
		var iters = this.maxIters;
		while(!allGood && iters > 0){
			var misClassed = 0;
			for(var i = 0; i< this.xTr.length; i ++){
				var pred = this.classif(this.xTr[i][0], this.xTr[i][1]);
				if(this.yTr[i] != pred){
					misClassed += 1;
					let y = this.cl2pr(this.yTr[i]);
					this.w[0] += y * this.xTr[i][0];
					this.w[1] += y * this.xTr[i][1];
					this.w[2] += y * 100;
				}
			}
			if(misClassed === 0)
				allGood = true;
			iters --;
		}
		return;
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
		return this.generateInfo({
			name: "Perceptron",
			tldr: "Drawing a line in the sand",
			expl: <div>Comes up with a <b>flat space that cleanly separates the data</b>.</div>,
			params: ["Max Iters (\u2264 100): Maximum number of updates for training"],
			usecase: ["Binary Classification", "Regression"],
			expl2: ["One of the oldest algorithms out there - cause it's a very simple one. In mathematical terms, we simply solve for a linear combination of the inputs (ie. h = ax + by + cz..., where x, y, z are inputs and a, b, c are constants), then use this output h to predict - positive h for Class A , negative h for Class B. In an intuitive sense, we're finding a straight boundary that exactly cuts through the data.",
				"It's easy to visualize it as a line if the data is two-dimensional - as in our case. In three dimensions, it's a plane. In four dimensions, it's an entire 3d space - not so easy to visualize anymore.",
				"The history behind the perceptron is quite an interesting one. Soon after its invention by Rosenblatt at Cornell in 1957, it was hyped up to be the \"next big thing\" - the New York Times, for example, reported that the perceptron \"will be able to walk, talk, see, write, reproduce itself and be conscious of its existence.\"", 
				"However, it became rather clear that it could achieve non of these feats - it couldn't even recognize a circle, for example (try it!). This led to an abrupt end in perceptron research in 1969 - what we now call one of several \"AI winters\". Perhaps this serves as a cautionary tale for our own golden age of Machine Learning..."],
			pros: ["Simple to implement", "Tiny, tiny model (boils down to small list of numbers!)"],
			cons: ["Assumes linearly separable data - does poorly otherwise",
				"Can end up with bad fits with points right on the 'edge'"],
			links: [
				<a target = "_blank" href = "https://en.wikipedia.org/wiki/Perceptron">Wikipedia: Perceptron</a>,
				<a target = "_blank" href = "http://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Perceptron.html">SKlearn perceptron package</a>,
				<a target = "_blank" href = "http://www.cs.cornell.edu/courses/cs4780/2017sp/lectures/lecturenote03.html">Perceptron math notes (Cornell CS 4780, Weinberger)</a>
			]
		});
	}
}