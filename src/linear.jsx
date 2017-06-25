import S from "./s";
import React from "react";
import math from "mathjs";
import MLModel from "./mlmodel";

export default class Linear extends MLModel {
	constructor(){
		super();
		this.w = [0, 0, 0];
	}
	classif(x, y){
		var result = this.w[0] * x + this.w[1] * y + this.w[2];
		//console.log(this)
		return this.pr2cl(result);
	}
	train(){
		var xAp = math.concat(math.matrix(this.xTr), math.ones(this.xTr.length, 1));
		var xTrans = math.transpose(xAp);
		var inv = math.inv(math.multiply(xTrans, xAp));
		var self = this;
		var yTr_conv = this.yTr.map(function(v){
			return self.cl2pr(v);
		});
		var xy = math.multiply(xTrans, yTr_conv);
		this.w = math.multiply(inv, xy).valueOf();
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