import React from "react";

export default class Knn {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.k = 3;
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
	batchClassif(input){
		return new Promise((ok, err) => {
			var output = input.map((i)=>{
				return this.classif(i[0], i[1]);
			});
			ok(input, output);
		});
	}
	classif(x, y){
		var knn_xTr_dist = [];
		var knn_yTr = [];
		for (var i = 0; i < this.xTr.length; i ++){
			var ii = 0;
			var notInserted = true;
			while(ii < this.k && notInserted){
				var dist = this.dist(x, y, this.xTr[i][0], this.xTr[i][1]);
				if(knn_xTr_dist[ii] == undefined){
					knn_xTr_dist[ii] = dist;
					knn_yTr[ii] = this.yTr[i];
					notInserted = false;
				}
				else if (knn_xTr_dist[ii] > dist){
					knn_xTr_dist.splice(ii, 0, dist);
					knn_yTr.splice(ii, 0, this.yTr[i]);
					notInserted = false;
					knn_xTr_dist = knn_xTr_dist.slice(0, this.k);
					knn_yTr = knn_yTr.slice(0, this.k);
				}
				ii ++;
			}
		}
		var bucket = [];
		for (var i = 0; i < this.k; i ++){
			bucket[knn_yTr[i]] = bucket[knn_yTr[i]] ? bucket[knn_yTr[i]] + 1 : 1;
		}
		return this.maxIndex(bucket);
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
		return;
	}
	getClassif(){
		return (x, y) => this.classif(x, y);
	}
	setK(k){
		var _k = parseInt(k);
		if(isNaN(_k) && k != "") return false;
		if(k != "")
			this.k = _k;
		return true;
	}
	uiInstance(){
		var setK = this.setK.bind(this);//this.setK.bind(this);
		return(
			class KnnUi extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						value: ""
					};
					this.onChange = this.onChange.bind(this);
				}
				onChange(e){
					if(setK(e.target.value)) {
						this.setState({
							value: e.target.value
						});
					}
				}
				render(){
					return(
						<div>
							K: <input value = {this.state.value} onChange = {this.onChange}/>
						</div>
					);
				}
			}
		);
	}
}