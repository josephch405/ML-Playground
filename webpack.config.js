var webpack = require("webpack");
var path = require("path");

var BUILD_DIR = path.join(__dirname, "build");
var APP_DIR = path.join(__dirname, "src");

var config = {
	entry: {main: APP_DIR + "/main.jsx"},
	output: {
		path: BUILD_DIR,
		filename: "./js/[name].bundle.js",
		publicPath: "build"
	},
	module: {
		loaders: [{
			test: /\.jsx?/,
			include: APP_DIR,
			loader: "babel-loader",
			query: {
				presets:["es2015", "react"]
			}
		}, {
			test: /\.less$/,
			include: APP_DIR,
			loader: "style-loader!css-loader!less-loader"
		},{ test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			include: APP_DIR,
			loader : "file-loader" 
		}, {
			test: /\.(jpe?g|png|gif|svg)$/i,
			loaders: [
				"url-loader"
			]
		}]
	},
	resolve: {
		extensions: [".js", ".jsx", ".css"]
	},
	node: {
		fs: "empty"
	}
};



module.exports = config;