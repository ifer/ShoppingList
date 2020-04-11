// This library allows us to combine paths easily
const path = require('path');

//Text css extractor
const ExtractTextPlugin = require("extract-text-webpack-plugin");


// const PROD = process.argv.indexOf('-p') !== -1; // if webpack is called with -p, PROD = true
// const STAGING = process.argv.indexOf('-s') !== -1; // if webpack is called with -s, STAGING = true



module.exports = (env) => {
  return {
      entry: path.resolve(__dirname, "src", "index.js"),
      output: {
        path: path.resolve(__dirname, "output"),
        filename: "bundle.js"
        // publicPath: '/'
      },
      resolve: {
        extensions: [".js", ".jsx"]
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: [/node_modules/],
            use: {
              loader: "babel-loader",
              options: { presets: ["es2015", "react"] }
            }
          },

          {                                     //extract style.css for prod only
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",              //for dev mode
              use: "css-loader"
            })
          },
          {
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)$/,
            use: ["url-loader?limit=100000"]
          },
          {
              test: /\.ico$/,
              loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
           }

        ]
      },
      plugins: [new ExtractTextPlugin("style.css")],        //Text css extractor
      devServer: {
        port: 8080,  
        contentBase: "./src",
        publicPath: "/output",
        historyApiFallback: true
      },
      node: {
        fs: "empty"
      },
      externals: {   //External configuration files
          'Config': JSON.stringify(env === "production" ? require('./config.prod.json') : (env === "staging" ? require('./config.staging.json') : require('./config.dev.json')))
      },

      devtool: "source-map" //Maps source files with bundle.js for debugging in the browser
    }
};
