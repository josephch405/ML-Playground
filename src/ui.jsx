/*jshint esversion: 6 */

import React from "react";

import S from "./s";

export default class UI extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selected: S.class1
		};
	}
	handleChange(e){
		this.setState({
			selected: e.target.value
		});
		this.props.setClass(e.target.value);
	}
	train(){
		this.props.train();
	}
	render(){
		var ModelUI = this.props.modelUI;
		return(
			<div id = "brushes">
				<label id = "class1"><input value = {S.class1} type = "radio" checked = {this.state.selected == S.class1} onChange = {(e) => {this.handleChange(e);}}/>Class 1</label>
				<label id = "class2"><input value = {S.class2} type = "radio" checked = {this.state.selected == S.class2} onChange = {(e) => {this.handleChange(e);}}/>Class 2</label>
				<label id = "class3"><input value = {S.class3} type = "radio" checked = {this.state.selected == S.class3} onChange = {(e) => {this.handleChange(e);}}/>Class 3</label>
				<br/>
				<button onClick = {() => {this.train();}}>Train</button>
				<ModelUI/>
			</div>
		);
	}
}