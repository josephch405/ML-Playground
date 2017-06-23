import S from "./s";
import React from "react";
import {default as m} from "mathjs";

export default class Ann {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.hiddenCount = 20;
		this.A = [m.matrix(m.random([this.hiddenCount, 2], -.5, .5)),
			m.matrix(m.random([1, this.hiddenCount], -.5, .5))];
		this.b = [m.matrix(m.random([1, this.hiddenCount], -1, 1).valueOf()[0]), 0];
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		yTr = parseInt(yTr);
		this.xTr.push(xTr);
		this.yTr.push(yTr);
		return;
	}
	setTraining(xTr, yTr){
		this.xTr = xTr;
		this.yTr = yTr;
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
	train(){
		this.A = [m.matrix(m.random([this.hiddenCount, 2], -.5, .5)),
		m.matrix(m.random([1, this.hiddenCount], -.5, .5))];
		this.b = [m.matrix(m.random([1, this.hiddenCount], -.1, .1).valueOf()[0]), 
		m.matrix(m.random([1, 1], -.1, .1).valueOf()[0])];
		function vvMult(v1, v2){
			v1 = m.transpose(m.matrix([v1]));
			v2 = m.matrix([v2]);
			var ret = m.multiply(v1, v2)
			if (typeof ret == "number")
				return m.matrix([[ret]]);
			if (ret.size().length == 1)
				return m.matrix([ret]);
			return ret;
		}

		function toArr(input){
			if(input.size){
				return m.squeeze(input);
			}
			if(input.length){
				return input;
			}
			return [input];
		}

		// console.log("init")
		var alpha = 0.03;
		var self = this;
		var yTr = this.yTr.map(function(i){
			return self.cl2pr(i);
		});
		var xTr = this.xTr.map(function(i){
			return m.divide(i.slice(), 50);
		});
		function shuffle(a, b) {
			for (let i = a.length; i; i--) {
				let j = Math.floor(Math.random() * i);
				[a[i - 1], a[j]] = [a[j], a[i - 1]];
				[b[i - 1], b[j]] = [b[j], b[i - 1]];
			}
		}
		//var g = [0, 0];
		var err = 0;
		// console.log("cycle")
		for(var i = 0; i < 2000; i ++){
			err = 0;
			shuffle(xTr, yTr);
			// console.log("wtf")
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
					_A[l] = m.subtract(_A[l], m.chain(alpha).multiply(vvMult(delta[l], z[l])).done());
					// console.log("l: ", l, "A[l]: ", _A[l])
					// console.log("_b")
					// console.log(_b[l], delta[l])
					_b[l] = m.subtract(_b[l], m.squeeze(m.multiply(alpha, delta[l])));
					// console.log("l: ", l, "b[l]: ", _b[l])
					if(l != 0){
						// console.log("bin bin bin")
						var der = m.subtract(1, m.square(z[l]));
						// console.log(der)
						var tpDelt = m.squeeze(m.multiply(m.transpose(this.A[l]), delta[l]));
						// console.log(tpDelt)
						var d = m.dotMultiply(der, tpDelt);
						// console.log(d)
						delta[l - 1] = d;
						//g[l-1] = m.add(m.multiply(g[l-1], .2), delta[l-1]);
						// console.log("l: ", l-1, "delta[l]: ", delta[l-1])

						//g[l - 1] = m.add(m.multiply(g[l - 1], .2), delta[l - 1]);
					}
				}
				//_b[1] = 0;
			}
			this.A = _A;
			this.b = _b;
			err /= xTr.length;
			if(i%100 == 0)
				console.log(err)
			if(err < 0.05){
				break;
			}
			//alpha *= .95
		}
		console.log(err)

		console.log(this.A, this.b)
		console.log(xTr, yTr)
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
	getClassif(){
		return (x, y) => this.classif(x, y);
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