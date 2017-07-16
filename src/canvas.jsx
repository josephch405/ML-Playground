import S from "./s";

let WIDTH = S.canvasW;
let HEIGHT = S.canvasH;
let PSIZE = S.ptSize;
let BGRESO = S.bgReso;
let H_INTERV = HEIGHT / BGRESO;
let W_INTERV = WIDTH / BGRESO;

export default class Canvas {
	//setup and simple helpers
	constructor(canvas){
		this.canvasElem = canvas;
		this.ctx = canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
		//rect is offset of canvas in window
		this.rect = canvas.getBoundingClientRect();
		this.brush = S.class1;
		this.bgInput = [];
		for (var i = - W_INTERV * BGRESO / 2; i <= W_INTERV * BGRESO / 2; i += BGRESO){
			for (var ii = - H_INTERV * BGRESO / 2; ii <= H_INTERV * BGRESO / 2; ii += BGRESO){
				this.bgInput.push([i, ii]);
			}
		}
		console.log(this.bgInput)
		this.batchEvalPixels = this.batchEvalPixels.bind(this);
		this.batchDrawPixels = this.batchDrawPixels.bind(this);
		this.drawStoreTr = this.drawStoreTr.bind(this);
	}
	getMousePos(evt){
		this.rect = this.canvasElem.getBoundingClientRect();
		var left = (evt.clientX - this.rect.left) / this.canvasElem.scrollWidth * WIDTH;
		var top = (evt.clientY - this.rect.top) / this.canvasElem.scrollHeight * HEIGHT;
		return [left - WIDTH / 2, 
			-(top - HEIGHT / 2)
		];
	}
	clearCtx(){
		this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}
	//---

	//used by main.jsx
	setBrush(brush){
		this.brush = brush;
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
	//---


	//synchronous drawing functions
	drawPixel(x, y, cl){
		this.ctx.fillStyle = S.bgColors[cl];
		this.ctx.fillRect(
			x + WIDTH / 2, 
			- y + HEIGHT / 2, 
			BGRESO, 
			BGRESO
		);
	}
	drawPoint(x, y, cl){
		this.ctx.fillStyle = S.colors[cl];
		this.ctx.fillRect(
			x - PSIZE/2 + WIDTH / 2, 
			- y - PSIZE/2 + HEIGHT / 2, 
			PSIZE, 
			PSIZE
		);
	}
	//---

	//promise based functions
	drawStoreTr(){
		let xTr = this.store.xTr;
		let yTr = this.store.yTr;
		for(var i = 0; i < xTr.length; i ++){
			this.drawPoint(xTr[i][0], xTr[i][1], yTr[i]);
		}
	}
	batchEvalPixels(batchClassif){
		return new Promise((ok)=>{
			batchClassif(this.bgInput).then(ok);
		});
	}
	batchDrawPixels(input){
		var xTr = input[0];
		var yTr = input[1];
		return new Promise((ok, err)=>{
			for(var i = 0; i < xTr.length; i ++){
				this.drawPixel(xTr[i][0], xTr[i][1], yTr[i]);
			}
			ok();
		});
	}
	//---

	trainAndClassif(){
		this.clearCtx();
		this.store.batchTrainAndClassif()
			.then(this.batchEvalPixels)
			.then(this.batchDrawPixels)
			.then(this.drawStoreTr);
	}
}