let WIDTH = 600;
let HEIGHT = 600;
let COLORS = []

export class Canvas {
	constructor(canvas){
		this.canvasElem = canvas;
		this.ctx = canvas.getContext("2d");
		//rect is offset of canvas in window
		this.rect = canvas.getBoundingClientRect();
	}
	getMousePos(evt) {
    return {
        x: evt.clientX - this.rect.left,
        y: evt.clientY - this.rect.top
    }
    plotWithClassif(classifier, isRegression){
    	//classifier takes in x, y, returns some output - int or maybe float
    	for(var i = 0; i < WIDTH; i++){
    		for (var ii = 0; ii < HEIGHT; ii++){

    		}
    	}
    }
    plotWithTr(xTr, yTr, isRegression){
    	//takes in data points to plot
    	//type: "c" vs "r"
    }
}