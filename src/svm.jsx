import S from "./s";
import React from "react";
import NodeSvm from "svm";
import MLModel from "./mlmodel";

export default class SVM extends MLModel {
	constructor(){
		super();
		this.isRbf = false;
		this.C = 10;
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
		this.isRbf ? this.svm.train(x, y, {C: this.C, kernel:"rbf", rbfsigma: .5}) : 
			this.svm.train(x, y, {C: this.C, kernel:"linear"});
		return;
	}
	setRbf(bool){
		this.isRbf = bool;
		return true;
	}
	setC(c){
		if(!isNaN(parseFloat(c))){
			this.C = parseFloat(c);
			return true;
		}
		return false;
	}
	uiInstance(){
		var self = this;
		return(
			class SvmUI extends React.Component{
				constructor(props){
					super(props);
					this.state = {
						isRbf: self.isRbf,
						C: self.C
					};
				}
				onChangeRbf(e){
					if(self.setRbf(e.target.checked)) {
						this.setState({
							isRbf: e.target.checked
						});
					}
				}
				onChangeC(e){
					if(self.setC(e.target.value)) {
						this.setState({
							C: e.target.value
						});
					}
				}
				render(){
					return(
						<div>
							C: <input type = "text" value = {this.state.C} onChange = {(e)=>this.onChangeC(e)}/><br/>
							RBF Kernel?: <input name = "rbf" type = "checkbox" checked = {this.state.isRbf} onChange = {(e)=>this.onChangeRbf(e)}/>
						</div>
					);
				}
			}
		);
	}
	info(){
		return this.generateInfo({
			name: "Support Vector Machine",
			tldr: "Personal space, please",
			expl1: <div>Picks a hyperplane separating the data, but maximizes margin. (Credits: Andrej Karpathy's <a href = "https://www.npmjs.com/package/svm">svm</a> Node package)</div>,
			params: ["C (\u2265 0): Regularization constant. How hard the SVM will try to fit all your data at risk of overfitting with overly complex model",
				"RBF Kernel: Default is unselected - uses Linear SVM. Toggle to use RBF Kernel SVM"],
			usecase: ["Binary Classification", "Multi-class Classification", "Regression"],
			expl2: ["Basically a perceptron on steroids. By \"margin\", we mean \"the distance between plane and point closest to plane\". So by maximizing the margin, we are making sure that all points are as far away from the decision boundary as they can be.",
				"Originally, we start with a linear SVM - meaning that our dividing hyperplane, much like the perceptron, \"operates\" with straight lines as boundaries. Obviously this is a bit limiting - we still can't recognize circles! Not all is lost, however - we can introduce some helpful changes.",
				"The Kernel Trick (makes it sound almost like magic...) is when we go from a Primal SVM formation to a Dual formation. Complicated math aside, this effectively means that you're 'multiplying' a test vector by select Support Vectors, then combining the products to form a good prediction. (Refer to resources for complex definition)",
				"With a Linear SVM, we are essentially using a Dot Product as the 'Multiplication' for the Dual. We could replace this with other forms of 'multiplication' methods, which are called Kernels. A very popular choice is the RBF kernel - the 'multiplications' end up relying on net distance between test points, so in effect it's actually sort of like KNN, but much more regularized."],
			pros: ["Option to regularize - ie. reduce overfitting by preferring 'simpler' models over complex ones. Try tweaking C to see its effects!",
				"Parametric (Linear SVM): model remains same size regardless of dataset size"],
			cons: ["Non-parametric (RBF Kernel SVM): model itself may get more complicated as data set grows"],
			links: [
				<a href = "https://en.wikipedia.org/wiki/Support_vector_machine">Wikipedia: Support vector machine</a>,
				<a href = "http://scikit-learn.org/stable/modules/svm.html">SKlearn Support Vector Machines overview </a>,
				<a href = "http://www.cs.cornell.edu/courses/cs4780/2017sp/lectures/lecturenote09.html">SVM math notes (Cornell CS 4780, Weinberger)</a>,
				<a href = "http://www.cs.cornell.edu/courses/cs4780/2017sp/lectures/lecturenote13.html">Kernels math notes (Cornell CS 4780, Weinberger)</a>,
				<a href = "http://cs229.stanford.edu/materials/smo.pdf">Math behind simplified SMO SVM algorithm used in the Karpathy package</a>
			]
		});
	}
}