import {array} from 'lodash'

export class Knn {
	Constructor(){
		this.xTr = [];
		this.yTr = [];
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		if(typeof yTr == "number"){
			//might wanna include error throwing if xTr is badly formed
			this.xTr.push(xTr);
			this.yTr.push(yTr);
		}
	}
	classif(x, y){
		for (var i = 0; i < xTr.length; i ++){
			
		}
	}
}