class regStore {
	constructor(){
		this.xTr = [];
		this.yTr = [];
	}
}

export default class Store{
	constructor(){
		this.xTr = [];
		this.yTr = [];
	}
	addPoint(xTr, yTr){
		this.xTr.push(xTr);
		this.yTr.push(yTr);
		this.classif.addPt(xTr, yTr);
	}
	clearStore(){
		this.xTr = [];
		this.yTr = [];
	}
	linkClassif(classif){
		this.classif = classif;
	}
}