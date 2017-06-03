import S from "./s"

export default class Knn {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.w = [0, 0, 0];
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		yTr = parseInt(yTr);
		/*console.log(yTr)
		console.log(typeof yTr)
		if(typeof yTr == "number"){*/
			//might wanna include error throwing if xTr is badly formed
		this.xTr.push(xTr);
		this.yTr.push(yTr);
		//}
		return;
	}
	classif(x, y){
		var result = this.w[0] * x + this.w[1] * y + this.w[2];
		return this.pr2cl(result);
	}
	maxIndex(arr){
		var bestIndex = -1;
		var bestVar = -Infinity;
		for (var i = 0; i < arr.length; i ++){
			if(arr[i] > bestVar){
				bestVar = arr[i];
				bestIndex = i;
			}
		}
		return bestIndex;
	}
	dist(x1, y1, x2, y2){
		return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	}
	train(){
		this.w = [0,0,0];
		var allGood = false;
		while(!allGood){
			var misClassed = 0;
			for(var i = 0; i< this.xTr.length; i ++){
				var pr = this.classif(this.xTr[i][0], this.xTr[i][1]);
				if(this.yTr[i] != this.pr2cl(pr)){
					misClassed += 1;
					let y = this.cl2pr(this.yTr[i]);
					this.w[0] += y * this.xTr[i][0];
					this.w[1] += y * this.xTr[i][1];
					this.w[2] += y * 1;
				}
			}
			if(misClassed === 0)
				allGood = true;
		}

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
}