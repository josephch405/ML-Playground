/*jshint esversion: 6 */

import React from "react";

import S from "./s";

import Knn from "./knn";
import Perceptron from "./perceptron";
//import Linear from "./linear";
import SVM from "./svm";
import Ann from "./ann";

const modelList = [new Knn(), new Perceptron(), new SVM(), new Ann()];
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
		this.handleChange = this.handleChange.bind(this);
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
		this.props.renderInfo(modelList[i].info());
	}
	train(){
		this.props.train();
	}
	render(){
		return(
			<div>

				<div id = "brushes">
				Click to add data points: 
					{[S.class1, S.class2, S.eraser].map((i)=>{
						return(
							<div key = {i}>
								<input id = {"br-" + i} value = {i} type = "radio" checked = {this.state.brushSelected == i} onChange = {this.handleChange}/>
								<label htmlFor={"br-" + i}></label>
							</div>
						);
					})}
				</div>

				<div id = "model-selector">
					<div className = {this.state.modelSelected == S.model[0]} onClick = {() => this.changeModel(S.model[0])}><img src = "./build/img/knn.png"/> <h4>K Nearest Neighbors</h4> </div>
					<div className = {this.state.modelSelected == S.model[1]} onClick = {() => this.changeModel(S.model[1])}><img src = "./build/img/perceptron.png"/> <h4> Perceptron </h4> </div>
					<div className = {this.state.modelSelected == S.model[2]} onClick = {() => this.changeModel(S.model[2])}><img src = "./build/img/linear.png"/> <h4> Support Vector Machine</h4> </div>
					<div className = {this.state.modelSelected == S.model[3]} onClick = {() => this.changeModel(S.model[3])}><img src = "./build/img/ann.png"/> <h4> Artificial Neural Network </h4> </div>
				</div>

				<h3>Parameters:</h3>
				<this.state.modelUi/><br/>
				<button id = "trainAndDisplay" onClick = {() => {this.train();}}>Train</button>

			</div>
		);
	}
}