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
			return [c[0] / 200, c[1] / 200]
		})
		this.svm = new NodeSvm.SVM();
		this.svm.train(x, y, {C: 100, kernel:"rbf", rbfsigma: .5});
		//this.svm.train(x, y, {C: 100, kernel:"linear"});
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