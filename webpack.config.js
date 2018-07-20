/**
 * Created by hope.kim on 5/31/18.
 */

const path                 = require('path');
const webpack              = require('webpack');

console.log("webpack is building")

webpack({
  mode: 'development',
  entry: './getScreenings.js',

  // define output point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'getScreenings.js'
  },

  module: {
    rules: [
      {
        test: /\.js?$/, //tells webpack that this loader should only test on js files
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        }
      }
    ],
  }
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    console.log("some errrors bundling js")
    console.log(err)
    console.log(stats)
  }
  console.log("done processing js");
});

