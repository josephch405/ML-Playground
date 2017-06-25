import S from "./s";
import React from "react";
import MLModel from "./mlmodel";

export default class Perceptron extends MLModel {
	constructor(){
		super();
		this.w = [0, 0, 0];
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
		this.w = [0,0,0];
		var allGood = false;
		var iters = 10000;
		while(!allGood && iters > 0){
			var misClassed = 0;
			for(var i = 0; i< this.xTr.length; i ++){
				var pred = this.classif(this.xTr[i][0], this.xTr[i][1]);
				if(this.yTr[i] != pred){
					misClassed += 1;
					let y = this.cl2pr(this.yTr[i]);
					this.w[0] += y * this.xTr[i][0];
					this.w[1] += y * this.xTr[i][1];
					this.w[2] += y * 1;
				}
			}
			if(misClassed === 0)
				allGood = true;
			iters --;
		}
		return;
	}
	uiInstance(){
		//var setK = this.setK.bind(this);//this.setK.bind(this);
		return(
			class PerceptronUI extends React.Component{
				constructor(props){
					super(props);
					// this.state = {
					// 	value: ""
					// };
					// this.onChange = this.onChange.bind(this);
				}
				// onChange(e){
				// 	if(setK(e.target.value)) {
				// 		this.setState({
				// 			value: e.target.value
				// 		});
				// 	}
				// }
				render(){
					return(
						<div>
							Non yet
						</div>
					);
				}
			}
		);
	}
}