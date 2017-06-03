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
		this.classif.setTraining(this.xTr, this.yTr);
	}
	clearStore(){
		this.xTr = [];
		this.yTr = [];
		this.classif.setTraining(this.xTr, this.yTr);
	}
	linkClassif(classif){
		this.classif = classif;
	}
	trainAndClassif(){
		this.classif.train();
		return this.classif.getClassif();
	}
}