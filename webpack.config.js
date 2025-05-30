var webpack = require("webpack");
var path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

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
		rules: [{
			test: /\.jsx?/,
			include: APP_DIR,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"]
				}
			}
		}, {
			test: /\.less$/,
			include: APP_DIR,
			use: ["style-loader", "css-loader", "less-loader"]
		},{ test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
			include: APP_DIR,
			type: 'asset/resource'
		}, {
			test: /\.(jpe?g|png|gif|svg)$/i,
			type: 'asset/resource'
		}]
	},
	resolve: {
		extensions: [".js", ".jsx", ".css"],
		fallback: { fs: false }
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
};



module.exports = config;