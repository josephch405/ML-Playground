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
		this.dispatchToClassif();
	}
	erase(xTr){
		var bestInd = -1;
		var bestDist = Infinity;
		this.xTr.forEach((x, i)=>{
			let dist = this.dist(xTr, x);
			if(dist < bestDist){
				bestInd = i;
				bestDist = dist;
			}
		});
		if(bestInd > -1){
			this.xTr.splice(bestInd, 1);
			this.yTr.splice(bestInd, 1);
			this.dispatchToClassif();
		}
	}
	clearAll(){
		this.xTr = [];
		this.yTr = [];
		this.dispatchToClassif();
	}
	dispatchToClassif(){
		this.classif.setTraining(this.xTr, this.yTr);
	}
	dist(X, Y){
		var d1 = X[0] - Y[0];
		var d2 = X[1] - Y[1];
		return Math.sqrt(d1 * d1 + d2 * d2);
	}
	clearStore(){
		this.xTr = [];
		this.yTr = [];
		this.dispatchToClassif();
	}
	linkClassif(classif){
		this.classif = classif;
		this.dispatchToClassif();
	}
	batchTrainAndClassif(){
		return new Promise((ok, err)=>{
			this.classif.train();
			ok(this.classif.getClassif());
		});
	}
	exportJSONString(){
		return JSON.stringify([this.xTr, this.yTr]);
	}
	importJSONString(str){
		let obj = JSON.parse(str);
		this.xTr = obj[0];
		this.yTr = obj[1];
		this.dispatchToClassif();
	}
}