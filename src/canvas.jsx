let WIDTH = 400;
let HEIGHT = 400;
let PSIZE = 6;

import S from "./s";

export default class Canvas {
	constructor(canvas){
		this.canvasElem = canvas;
		this.ctx = canvas.getContext("2d");
		//rect is offset of canvas in window
		this.rect = canvas.getBoundingClientRect();
		this.brush = S.class1;
		this.bgInput = [];
		for (var i = -WIDTH / 2; i <= WIDTH / 2; i += 2){
			for (var ii = -HEIGHT / 2; ii <= HEIGHT / 2; ii += 2){
				this.bgInput.push([i, ii]);
			}
		}
	}
	getMousePos(evt){
		this.rect = this.canvasElem.getBoundingClientRect();
		return [evt.clientX - this.rect.left - WIDTH / 2, 
			-(evt.clientY - this.rect.top - HEIGHT / 2)
		];
	}
	clearCtx(){
		this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}
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
	drawStoreTr(){
		let xTr = this.store.xTr;
		let yTr = this.store.yTr;
		for(var i = 0; i < xTr.length; i ++){
			this.drawPoint(xTr[i][0], xTr[i][1], yTr[i]);
		}
	}
	drawBgWithClassif(classif){
		for (var i = -WIDTH / 2; i <= WIDTH / 2; i += 2){
			for (var ii = -HEIGHT / 2; ii <= HEIGHT / 2; ii += 2){
				this.drawPixel(i, ii, classif(i, ii));
			}
		}
	}
	batchDrawBg(batchClassif, callback){
		var err = () => {console.log("Error!")}
		var ok = () => {console.log("Error!")}
		batchClassif(this.bgInput).then(this.batchDrawPoint);
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
	batchDrawPoint(xTr, yTr){
		return new Promise((ok, err)=>{
			for(var i = 0; i < xTr.length; i ++){
				this.drawPoint(xTr[i][0], xTr[i][1], yTr[i]);
			}
			ok();
		});
	}
	//draws background pixel at x, y, of class cl
	//synchronous
	drawPixel(x, y, cl){
		this.ctx.fillStyle = S.bgColors[cl];
		this.ctx.fillRect(
			x + WIDTH / 2, 
			- y + HEIGHT / 2, 
			2, 
			2
		);
	}
	trainAndClassif(callback){
		this.clearCtx();
		this.currentClassif = this.store.trainAndClassif();
		this.drawBgWithClassif(this.currentClassif);
		
		this.drawStoreTr();
	}
}