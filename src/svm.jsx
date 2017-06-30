import S from "./s";
import React from "react";
import NodeSvm from "svm";
import MLModel from "./mlmodel";

export default class SVM extends MLModel {
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
		//this.svm.train(x, y, {C: 1, kernel:"rbf", rbfsigma: .5});
		this.svm.train(x, y, {C: 10, kernel:"linear"});
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
	info(){
		return this.generateInfo(
			"Support Vector Machines",
			"Personal space, please",
			<div>Picks a hyperplane separating the data, but maximizes margin.</div>,
			["k (\u2265 1): number of closest neighbors to select"],
			["Binary Classification", "Multi-class Classification", "Regression"],
			[`Basically a perceptron on steroids. By "margin", we mean "the distance between plane and point closest to plane". So by maximizing the margin, we are making sure that all points are as far away from the decision boundary as they can be.`],
			["Option to regularize - ie. reduce overfitting by preferring 'simpler' models"],
			["Parametric - size of model grows as training data grows. It could take a long time to compute distances for billions of datapoints.",
				"Curse of Dimensionality - "]
			);
	}
}