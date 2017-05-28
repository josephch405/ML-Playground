import {array} from 'lodash'

export default class Knn {
	constructor(){
		this.xTr = [];
		this.yTr = [];
		this.k = 1;
		this.isRegression = false;
	}
	addPt(xTr, yTr){
		if(typeof yTr == "number"){
			//might wanna include error throwing if xTr is badly formed
			this.xTr.push(xTr);
			this.yTr.push(yTr);
		}
		return;
	}
	classif(x, y){
		knn_xTr_dist = [];
		knn_yTr = [];
		for (var i = 0; i < this.xTr.length; i ++){
			var ii = 0;
			var notInserted = true;
			while(ii < this.k && notInserted){
				dist = this.dist(x, y, this.xTr[i][0], this.xTr[i][1]);
				if(knn_xTr_dist[ii] == undefined){
					knn_xTr_dist[ii] = dist;
					knn_yTr[ii] = this.yTr[i];
					notInserted = false;
				}
				else if (knn_xTr_dist[ii] > dist){
					knn_xTr_dist.splice(ii, 0, dist);
					knn_yTr.splice(ii, 0, yTr[i]);
					notInserted = false;
					knn_xTr_dist = knn_xTr_dist.slice(0, this.k);
					knn_yTr_dist = knn_yTr_dist.slice(0, this.k);
				}
			}
		}
		for (var i = 0; i < this.k; i ++){

		}
	}
	dist(x1, y1, x2, y2){
		return Math.sqrt((x1 - x2)(x1 - x2) + (y1 - y2)(y1 - y2));
	}
	getClassif(){
		return this.classif;
	}
}