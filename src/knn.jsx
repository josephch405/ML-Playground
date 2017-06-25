import React from "react";
import MLModel from "./mlmodel";

export default class Knn extends MLModel{
	constructor(){
		super();
		this.k = 3;
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
	setK(k){
		var _k = parseInt(k);
		if(isNaN(_k) && k != "") return false;
		if(k != "")
			this.k = _k;
		return true;
	}
	uiInstance(){
		var self = this;
		var setK = this.setK.bind(this);
		return(
			class KnnUi extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						value: self.k
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
							K: <input type = "text" value = {this.state.value} onChange = {this.onChange}/>
						</div>
					);
				}
			}
		);
	}
	info(){
		return this.generateInfo(
			"K Nearest Neighbors",
			"Birds of a feather flock together",
			<div>Picks the <b>k closest points from training data</b>, then decides prediction via popular vote.</div>,
			["k (\u2265 1): number of closest neighbors to select"],
			["Binary Classification", "Multi-class Classification", "Regression"],
			<div>A simple and straightforward algorithm. The underlying assumption is that <b>datapoints close to each other share the same label</b>.<br/>
			Analogy: if I hang out with CS majors, then I'm probably also a CS major (or that one Philosophy major who's minoring in everything.)<br/>
			Note: distance can be defined different ways, such as Manhattan (sum of all features), Euclidean (geometric distance),
			p-norm distance...typically Euclidean is used, but Manhattan can be faster and thus preferable.</div>,
			["Simple to implement"],
			["Parametric - size of model grows as training data grows. It could take a long time to compute distances for billions of datapoints.",
			"Curse of Dimensionality - "]
			);
	}
}