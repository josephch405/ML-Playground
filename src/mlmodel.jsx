import S from "./s";
import React from "react";

export default class MLModel{
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.isRegression = false;
	}
	setTraining(xTr, yTr){
		this.xTr = xTr;
		this.yTr = yTr;
	}
	batchClassif(input){
		return new Promise((ok, err) => {
			var output = input.map((i)=>{
				return this.classif(i[0], i[1]);
			});
			ok([input, output]);
		});
	}
	classif(x, y){
		return;
	}
	train(){
		return;
	}
	getClassif(){
		return this.batchClassif.bind(this);
	}
	uiInstance(){
		return(<div>No options yet.</div>);
	}
	info(){
		return(<div>No info yet.</div>);
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
	generateInfo(name, tldr, expl1, params, usecase, expl2, pros, cons){
		return (<div>
			<h1>{name}</h1>
			<h2>TL;DR - {tldr}</h2>
			{expl1}
			<h2>Parameters</h2>
			<ul>
				{params.map((i)=>{
					return <li>{i}</li>;
				})}
			</ul>
			<h2>Use Cases:</h2>
			<ul>
				{usecase.map((i)=>{
					return <li>{i}</li>;
				})}
			</ul>
			{expl2}
			<h2>The Good</h2>
			<ul>
				{pros.map((i)=>{
					return <li>{i}</li>;
				})}
			</ul>
			<h2>The Bad</h2>
			<ul>
				{cons.map((i)=>{
					return <li>{i}</li>;
				})}
			</ul>

		</div>);
	}
}