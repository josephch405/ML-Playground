/*jshint esversion: 6 */

import React from "react";

import S from "./s";

import Knn from "./knn";
import Perceptron from "./perceptron";
import Linear from "./linear";
import SVM from "./svm";

const modelList = [new Knn(), new Perceptron(), new SVM()];
const modelUiList = modelList.map(function(model){
	return model.uiInstance();
});

export default class UI extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			brushSelected: S.class1,
			modelSelected: S.model[0],
			modelUi: modelUiList[0]
		};
	}
	componentDidMount(){
		this.changeModel(this.state.modelSelected);
	}
	handleChange(e){
		this.setState({
			brushSelected: e.target.value
		});
		this.props.setClass(e.target.value);
	}
	changeModel(target){
		var i = S.model.indexOf(target);
		if (i < 0)
			throw Error("Invalid model!");
		this.setState({
			modelSelected: target,
			modelUi: modelUiList[i]
		});
		this.props.store.linkClassif(modelList[i]);
	}
	train(){
		this.props.train();
	}
	render(){
		return(
			<div>

			<div id = "model-selector">
				<div className = {this.state.modelSelected == S.model[0]} onClick = {() => this.changeModel(S.model[0])}><img src = "./build/img/knn.png"/> <h4>K-NN</h4> </div>
				<div className = {this.state.modelSelected == S.model[1]} onClick = {() => this.changeModel(S.model[1])}><img src = "./build/img/perceptron.png"/> <h4> Perceptron </h4> </div>
				<div className = {this.state.modelSelected == S.model[2]} onClick = {() => this.changeModel(S.model[2])}><img src = "./build/img/linear.png"/> <h4> SVM</h4> </div>
			</div>

			<div id = "brushes">
				Click to add data points: 
				<label id = "class1"><input value = {S.class1} type = "radio" checked = {this.state.brushSelected == S.class1} onChange = {(e) => {this.handleChange(e);}}/></label>
				<label id = "class2"><input value = {S.class2} type = "radio" checked = {this.state.brushSelected == S.class2} onChange = {(e) => {this.handleChange(e);}}/></label>
				<label id = "class3"><input value = {S.class3} type = "radio" checked = {this.state.brushSelected == S.class3} onChange = {(e) => {this.handleChange(e);}}/></label>
				<br/>
			</div>

			<h3>Parameters:</h3>
			<this.state.modelUi/><br/>
			<button onClick = {() => {this.train();}}>Train</button>

			</div>
		);
	}
}