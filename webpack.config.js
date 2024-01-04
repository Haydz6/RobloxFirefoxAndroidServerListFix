const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './src/js/react/serverList/serverListEntry.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryExport: 'commonjs2'
  },
  mode: "production",
  optimization: {
    minimize: true,
    concatenateModules: true,
    minimizer: [new TerserPlugin({terserOptions: {
      keep_classnames: false
    }})],
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "Roblox": "Roblox",
    "react-dom/server": "ReactDOMServer",
    "roblox-badges": "RobloxBadges",
    "prop-types": "PropTypes",
    "core-utilities": "CoreUtilities",
    "header-scripts": "HeaderScripts",
    "roblox-thumbnails": "RobloxThumbnails",
    "roblox-item-purchase": "RobloxItemPurchase",
    "core-roblox-utilities": "CoreRobloxUtilities",
    "react-style-guide": "ReactStyleGuide",
    "react-utilities": "ReactUtilities",
    "../constants/browserConstants": "\"../constants/browserConstants\"",
    "../../../css/serverList/serverList.scss": "\"../../../css/serverList/serverList.scss\"",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname, "src", "node_modules")],
    // fallback: {
    //     ["core-utilities"]: require.resolve("./src/external _CoreUtilities_"),
    //     ["react"]: require.resolve("./src/external _React_"),
    //     ["react-dom"]: require.resolve("./src/external _ReactDOM_"),
    //     ["prop-types"]: require.resolve("./src/external _PropTypes_"),
    //     ["header-scripts"]: require.resolve("./src/external _HeaderScripts_"),
    //     ["react-style-guide"]: require.resolve("./src/external _ReactStyleGuide_"),
    //     ["react-utilities"]: require.resolve("./src/external _ReactUtilities_"),
    //     ["Roblox"]: require.resolve("./src/external _Roblox_"),
    //     ["roblox-item-purchase"]: require.resolve("./src/external _RobloxItemPurchase_"),
    //     ["roblox-badges"]: require.resolve("./src/external _RobloxBadges_"),
    //     ["roblox-thumbnails"]: require.resolve("./src/external _RobloxThumbnails_"),
    //     ["react-dom/server"]: require.resolve("./src/external _ReactDOMServer_"),
    //     ["core-roblox-utilities"]: require.resolve("./src/external _CoreRobloxUtilities_"),
    //     ["../constants/browserConstants"]: require.resolve("./src/external _BrowserConstants_"),
    //     ["../../../css/serverList/serverList.scss"]: require.resolve("./src/external _ServerList.scss_"),
    // }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options:{
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ],
  },
};