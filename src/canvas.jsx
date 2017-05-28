let WIDTH = 600;
let HEIGHT = 600;
let PSIZE = 8;
let COLORS = []

import S from './s'

export default class Canvas {
	constructor(canvas){
		this.canvasElem = canvas;
		this.ctx = canvas.getContext("2d");
		//rect is offset of canvas in window
		this.rect = canvas.getBoundingClientRect();
		this.brush = S.class1;
	}
	getMousePos(evt){
		return [evt.clientX - this.rect.left, 
		evt.clientY - this.rect.top]
    }
    plotWithClassif(classifier, isRegression){
    	//classifier takes in x, y, returns some output - int or maybe float
    	for(var i = 0; i < WIDTH; i++){
    		for (var ii = 0; ii < HEIGHT; ii++){

    		}
    	}
    }
    setBrush(brush){
    	this.brush = brush;
    }
    plotWithTr(xTr, yTr){//, isRegression){
    	//takes in data points to plot
    	//type: "c" vs "r"
    }
    linkToStore(store){
    	this.store = store;
    }
    onPointAdded(evt){
    	let xTr = this.getMousePos(evt);
    	let yTr = this.brush;
    	this.store.addPoint(xTr, yTr);
    	this.clearCtx();
    	this.drawStoreTr();
    }
    drawStoreTr(){
    	let xTr = this.store.xTr;
    	let yTr = this.store.yTr;
    	console.log(xTr)
    	console.log(yTr)
    	for(var i = 0; i < xTr.length; i ++){
    		console.log(yTr[i])
    		console.log(S.colors)
    		this.drawPoint(xTr[i][0], xTr[i][1], S.colors[yTr[i]])
    	}
    }
    clearCtx(){
    	this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    }
    drawPoint(x, y, color){
    	this.ctx.fillStyle = color;
    	this.ctx.fillRect(x - PSIZE/2, y - PSIZE/2, PSIZE, PSIZE)
    }
}