import S from "./s";
import React from "react";

export default class MLModel {
	constructor() {
		this.xTr = [];
		this.yTr = [];
		this.isRegression = false;
	}
	setTraining(xTr, yTr) {
		this.xTr = xTr;
		this.yTr = yTr;
	}
	batchClassif(input) {
		return new Promise((ok, err) => {
			var output = input.map((i) => {
				return this.classif(i[0], i[1]);
			});
			ok([input, output]);
		});
	}
	maxIndex(arr) {
		var bestIndex = -1;
		var bestVar = -Infinity;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] > bestVar) {
				bestVar = arr[i];
				bestIndex = i;
			}
		}
		return bestIndex;
	}
	classif(x, y) {
		return;
	}
	train() {
		return;
	}
	getClassif() {
		return this.batchClassif.bind(this);
	}
	uiInstance() {
		return (<div>No options yet.</div>);
	}
	info() {
		return (<div>No info yet.</div>);
	}
	pr2cl(pr) {
		if (pr > 0)
			return S.class1;
		return S.class2;
	}
	cl2pr(cl) {
		if (cl == S.class1)
			return 1;
		return -1;
	}
	generateInfo({ name, tldr, expl1, params, usecase, expl2, pros, cons, links }) {
		return (<div>
			<h1>{name}</h1>
			<h2>TL;DR - {tldr}</h2>
			{expl1}
			<h2>Parameters</h2>
			{this.liGen(params)}
			<h2>Use Cases:</h2>
			{this.liGen(usecase)}
			<div className = "para">
				{expl2.map((i, j)=><div className="col-xs-12" key = {j}>{i}</div>)}
			</div>
			<div className="good col-xs-12 col-md-6"><h2>The Good</h2>
			{this.liGen(pros)}</div>
			<div className="bad col-xs-12 col-md-6"><h2>The Bad</h2>
			{this.liGen(cons)}</div>
			<div className="col-xs-12">
				<h2>Learn more...</h2>
				{this.linkGen(links)}
			</div>
		</div>);
	}
	liGen(arr) {
		return <ul>{arr.map((i, j)=><li key = {j}>{i}</li>)}</ul>;
	}
	linkGen(arr) {
		return <ul>{arr.map((i, j)=><li key = {j}>
			<a target="_blank" href={i[0]}>{i[1]}</a>
			</li>)}</ul>;
	}
}