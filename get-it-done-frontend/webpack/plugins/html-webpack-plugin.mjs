import HtmlWebpackPlugin from "html-webpack-plugin";

import { paths } from "../configuration/paths.mjs";

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: "body",
  template: `${paths.public}/index.html`,
});
