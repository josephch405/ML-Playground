import S from "./s";
import React from "react";
import NodeSvm from "svm";
import MLModel from "./mlmodel";

export default class SVM extends MLModel {
	constructor(){
		super();
		this.isRbf = false;
	}
	classif(x, y){
		return this.pr2cl(this.svm.predict([[x/200, y/200]])[0]);
	}
	train(){
		var y = this.yTr.map((c)=>{
			return this.cl2pr(c);
		});
		var x = this.xTr.map((c)=>{
			return [c[0] / 200, c[1] / 200];
		});
		this.svm = new NodeSvm.SVM();
		this.isRbf ? this.svm.train(x, y, {C: 10, kernel:"rbf", rbfsigma: .5}) : 
			this.svm.train(x, y, {C: 10, kernel:"linear"});
		return;
	}
	setRbf(bool){
		this.isRbf = bool;
		return true;
	}
	uiInstance(){
		var self = this;
		var setRbf = this.setRbf.bind(this);
		return(
			class SvmUI extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						isRbf: self.isRbf
					};
					this.onChange = this.onChange.bind(this);
				}
				onChange(e){
					if(setRbf(e.target.checked)) {
						this.setState({
							isRbf: e.target.checked
						});
					}
				}
				render(){
					return(
						<div>
							RBF Kernel?: <input name = "rbf" type = "checkbox" checked = {this.state.isRbf} onChange = {this.onChange}/>
						</div>
					);
				}
			}
		);
	}
	info(){
		return this.generateInfo(
			"Support Vector Machine",
			"Personal space, please",
			<div>Picks a hyperplane separating the data, but maximizes margin.</div>,
			["k (\u2265 1): number of closest neighbors to select"],
			["Binary Classification", "Multi-class Classification", "Regression"],
			["Basically a perceptron on steroids. By \"margin\", we mean \"the distance between plane and point closest to plane\". So by maximizing the margin, we are making sure that all points are as far away from the decision boundary as they can be.",
				"Originally, we start with a linear SVM - meaning that our dividing hyperplane, much like the perceptron, \"operates\" with straight lines as boundaries. Obviously this is a bit limiting - we still can't recognize circles! Not all is lost, however - we can introduce some helpful changes.",
				"First, we change the way we look at the problem. Initially, the math behind an SVM roughly depends on MINIMIZING the sum of weighted errors, while keeping a low w vector.",
				"The Kernel Trick (makes it sound almost like magic...) is when we "],
			["Option to regularize - ie. reduce overfitting by preferring 'simpler' models"],
			["Parametric - size of model grows as training data grows. It could take a long time to compute distances for billions of datapoints.",
				"Curse of Dimensionality - "]
			);
	}
}