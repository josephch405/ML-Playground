import S from "./s";
import React from "react";
import math from "mathjs";

export default class Linear {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.w = [0, 0, 0];
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		yTr = parseInt(yTr);
		/*console.log(yTr)
		console.log(typeof yTr)
		if(typeof yTr == "number"){*/
			//might wanna include error throwing if xTr is badly formed
		this.xTr.push(xTr);
		this.yTr.push(yTr);
		//}
		return;
	}
	setTraining(xTr, yTr){
		this.xTr = xTr;
		this.yTr = yTr;
	}
	classif(x, y){
		var result = this.w[0] * x + this.w[1] * y + this.w[2];
		//console.log(this)
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
		var xAp = math.concat(math.matrix(this.xTr), math.ones(this.xTr.length, 1));
		var xTrans = math.transpose(xAp);
		var inv = math.inv(math.multiply(xTrans, xAp));
		var self = this;
		var yTr_conv = this.yTr.map(function(v){
			return self.cl2pr(v);
		});
		var xy = math.multiply(xTrans, yTr_conv);
		this.w = math.multiply(inv, xy).valueOf();
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
	getClassif(){
		return (x, y) => this.classif(x, y);
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