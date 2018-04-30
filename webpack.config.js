const path = require("path");

const entry = {};

[
  "add-package",
  "brew",
  "check-in",
  "directory",
  "history",
  "lend",
  "notes",
].forEach((name) => {
  entry[name] = `./${name}.ts`;
});

module.exports = {
  context: path.resolve(__dirname, "src/js"),
  entry: entry,
  output: {
    path: path.resolve(__dirname, "dist/js"),
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    }],
  },
  resolve: { extensions: [ ".tsx", ".ts", ".js" ] },
};
