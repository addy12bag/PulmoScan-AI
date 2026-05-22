const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // This should point to the src/index.js file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_BASE": JSON.stringify(
        process.env.REACT_APP_API_BASE || "http://localhost:5000"
      ),
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: false,
            sourceType: "unambiguous",
            presets: [
              [
                "@babel/preset-env",
                { targets: { electron: "24" }, modules: "commonjs" },
              ],
              ["@babel/preset-react", { runtime: "classic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Include JSX extensions
  },
};
