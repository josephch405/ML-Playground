import S from "./s";
import React from "react";
import NodeSvm from "svm";

export default class SVM {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.w = [0, 0, 0];
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		yTr = parseInt(yTr);
		this.xTr.push(xTr);
		this.yTr.push(yTr);
		return;
	}
	setTraining(xTr, yTr){
		this.xTr = xTr;
		this.yTr = yTr;
	}
	classif(x, y){

		return this.int2cl(this.svm.predict([[x, y]])[0]);
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
	train(){
		var y = this.yTr.map((c)=>{
			return this.cl2int(c);
		});
		console.log(this.xTr);
		console.log(y);
		this.svm = new NodeSvm.SVM();
		this.svm.train(this.xTr, y, {C: 1, kernel:"rbf", rbfsigma: 40});

		//this.svm.train(this.xTr, y, {C: 1e5, kernel:"linear", numpasses: 500, tol: 0});
		console.log(this.svm.margins(this.xTr));
		return;
	}
	getClassif(){
		return (x, y) => this.classif(x, y);
	}
	int2cl(n){
		if (n === 1)
			return S.class1;
		if (n === -1)
			return S.class2;
		return null;
	}
	cl2int(cl){
		if (cl == S.class1)
			return 1;
		if (cl == S.class2)
			return -1;
		return null;
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