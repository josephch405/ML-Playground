import {array} from 'lodash'

var knn = {
	setData: [],
	createNewSet: function(_n = 0, _c = '#FF0000'){
		return {
			name: _n,
			color: _c,
			points: []
		}
	},
	indexFromName: function(n){
		for (var i = 0; i < setData.size; i ++){
			if (this.setData.name + "" == n + "")
				return i
		}
		return null
	},
	addPointTo:function(n, pt){
		var ind = this.indexFromName(n);
		if(ind != null){
			this.setData[ind].points.push(pt)
		}
	},
	getPointsFrom:function(n){
		var ind = this.indexFromName(n);
		if(ind != null){
			return this.setData[ind].points
		}
	}
}

export default knn;