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
		return this.generateInfo({
			name: "K Nearest Neighbors",
			tldr: "Birds of a feather flock together",
			expl1: <div>Picks the <b>k closest points from training data</b>, then decides prediction via popular vote.</div>,
			params: ["k (\u2265 1): number of closest neighbors to select"],
			usecase: ["Binary Classification", "Multi-class Classification", "Regression"],
			expl2: ["A simple and straightforward algorithm. The underlying assumption is that datapoints close to each other share the same label.",
				"Analogy: if I hang out with CS majors, then I'm probably also a CS major (or that one Philosophy major who's minoring in everything.)",
				"Note that distance can be defined different ways, such as Manhattan (sum of all features), Euclidean (geometric distance), p-norm distance...typically Euclidean is used (like in this demo), but Manhattan can be faster and thus preferable."],
			pros: ["Simple to implement"],
			cons: ["Non-Parametric - size of model grows as training data grows. It could take a long time to compute distances for billions of datapoints.",
				"Curse of Dimensionality - as number of features increase (ie. more dimensions), the average distance between randomly distributed \
				points converge to a fixed value. This means that most points end up equidistant to each other - so distance becomes less meaningful as a metric"],
			links: [
				<a target = "_blank" href = "https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm">Wikipedia: k-nearest neighbors algorithm</a>,
				<a target = "_blank" href = "http://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html">SKlearn KNN classifier package</a>,
				<a target = "_blank" href = "http://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html">SKlearn KNN regressor package</a>,				
				<a target = "_blank" href = "http://www.cs.cornell.edu/courses/cs4780/2017sp/lectures/lecturenote02_kNN.html">KNN math notes (Cornell CS 4780, Weinberger)</a>
			]
		});
	}
}