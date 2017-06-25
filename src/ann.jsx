import S from "./s";
import React from "react";
import {default as m} from "mathjs";
import MLModel from "./mlmodel";

export default class Ann extends MLModel{
	constructor(){
		super();
		this.hiddenCount = 20;
		this.A = [m.matrix(m.random([this.hiddenCount, 2], -.5, .5)),
			m.matrix(m.random([1, this.hiddenCount], -.5, .5))];
		this.b = [m.matrix(m.random([1, this.hiddenCount], -1, 1).valueOf()[0]), 0];
	}
	relu(input){
		input.resize([input.size()[0], 2], 0);
		return m.max(input, 1);
	}
	tanh(input){
		return m.tanh(input);
	}
	classif(x, y){
		x = [[x/50, y/50], 0, 0];
		var ax = [0, 0];
		ax[0] = m.add(m.multiply(this.A[0], x[0]), this.b[0]);
		x[1] = this.tanh(ax[0]);
		ax[1] = m.add(m.multiply(this.A[1], x[1]), this.b[1]);
		x[2] = this.tanh(ax[1]);
		return this.pr2cl(x[2].valueOf()[0]);
	}
	vvMult(v1, v2){
		v1 = m.transpose(m.matrix([v1]));
		v2 = m.matrix([v2]);
		var ret = m.multiply(v1, v2);
		if (typeof ret == "number")
			return m.matrix([[ret]]);
		if (ret.size().length == 1)
			return m.matrix([ret]);
		return ret;
	}
	shuffle(a, b) {
		for (let i = a.length; i; i--) {
			let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
			[b[i - 1], b[j]] = [b[j], b[i - 1]];
		}
	}
	train(){
		this.A = [m.matrix(m.random([this.hiddenCount, 2], -.5, .5)),
			m.matrix(m.random([1, this.hiddenCount], -.5, .5))];
		this.b = [m.matrix(m.random([1, this.hiddenCount], -.1, .1).valueOf()[0]), 
			m.matrix(m.random([1, 1], -.1, .1).valueOf()[0])];

		var alpha = 0.03;
		var self = this;
		var yTr = this.yTr.map(function(i){
			return self.cl2pr(i);
		});
		var xTr = this.xTr.map(function(i){
			return m.divide(i.slice(), 50);
		});
		//var g = [0, 0];
		var err = 0;
		for(var i = 0; i < 2000; i ++){
			err = 0;
			this.shuffle(xTr, yTr);
			var _A = m.clone(this.A);
			var _b = m.clone(this.b);
			for(var ii = 0; ii < xTr.length; ii ++){
				var z = [0, 0, 0];
				var ax = [0, 0];
				z[0] = [xTr[ii][0], xTr[ii][1]];
				ax[0] = m.squeeze(m.add(m.multiply(this.A[0], z[0]), this.b[0]));
				z[1] = this.tanh(ax[0]);
				ax[1] = m.squeeze(m.add(m.squeeze(m.multiply(this.A[1], z[1])), this.b[1]));
				z[2] = this.tanh(ax[1]);
				var diff = z[2] - yTr[ii];
				var delta = [0, 0];
				delta[1] = m.multiply(diff, m.subtract(1, m.square(z[2])));
				err += Math.abs(diff);
				for(var l = 1; l >= 0; l--){
					_A[l] = m.subtract(_A[l], m.chain(alpha).multiply(this.vvMult(delta[l], z[l])).done());
					_b[l] = m.subtract(_b[l], m.squeeze(m.multiply(alpha, delta[l])));
					if(l != 0){
						var der = m.subtract(1, m.square(z[l]));
						var tpDelt = m.squeeze(m.multiply(m.transpose(this.A[l]), delta[l]));
						var d = m.dotMultiply(der, tpDelt);
						delta[l - 1] = d;
					}
				}
			}
			this.A = _A;
			this.b = _b;
			err /= xTr.length;
			if(err < 0.05){
				break;
			}
			//alpha *= .95
		}
		return;
	}
	pr2cl(pr){
		if (pr > 0)
			return S.class1;
		return S.class2;
	}
	cl2pr(cl){
		if(cl == S.class1)
			return 1;
		return -1;
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
		return (
			<div></div>
		);
	}
}