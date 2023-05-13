import { merge } from "webpack-merge";

// Import Configuration.
import { WebpackCommonConfig } from "./common.mjs";
import { config } from "./configuration/config.mjs";
import { paths } from "./configuration/paths.mjs";

const devServer = {
  open: true,
  compress: false,
  port: config.PORT,
  host: config.HOST,
  hot: true,
  proxy: {
    "/api": "http://localhost:3000",
  },
  client: {
    progress: true,
  },
  static: [
    {
      watch: true,
      directory: paths.dist,
    },
  ],
};

const WebpackConfig = {
  mode: "development",
  devServer,
  devtool: "cheap-module-source-map",
};

export const WebpackDevConfig = merge(WebpackCommonConfig, WebpackConfig);
