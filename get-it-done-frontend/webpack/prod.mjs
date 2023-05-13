import { merge } from "webpack-merge";

import { cleanWebpackPlugin } from "./plugins/clean-webpack-plugin.mjs";
import { WebpackCommonConfig } from "./common.mjs";

const plugins = [cleanWebpackPlugin];

const WebpackConfig = {
  plugins,
  optimization: {
    minimize: true,
  },
};

export const WebpackProdConfig = merge(WebpackCommonConfig, WebpackConfig);
