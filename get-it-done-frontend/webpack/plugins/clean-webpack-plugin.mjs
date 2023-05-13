import { CleanWebpackPlugin } from "clean-webpack-plugin";

import { paths } from "../configuration/paths.mjs";

export const cleanWebpackPlugin = new CleanWebpackPlugin({
  root: paths.dist,
});
