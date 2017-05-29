import React from 'react'

import S from './s'

export default class UI extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selected: S.class1
		}
	}
	handleChange(e){
		this.setState({
			selected: e.target.value
		})
		console.log(e.target.value)
		this.props.setClass(e.target.value);
	}
	train(){
		this.props.train();
	}
	render(){
		return(
			<div>
				<label><input value = {S.class1} type = "radio" checked = {this.state.selected == S.class1} onChange = {(e) => {this.handleChange(e)}}/>Class 1</label>
				<label><input value = {S.class2} type = "radio" checked = {this.state.selected == S.class2} onChange = {(e) => {this.handleChange(e)}}/>Class 2</label>
				<br/>
				<button onClick = {() => {this.train()}}>Train</button>
			</div>
		)
	}
}