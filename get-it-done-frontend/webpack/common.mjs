import path from "path";
import url from "url";

import { copyWebpackPlugin } from "./plugins/copy-webpack-plugin.mjs";
import { htmlWebpackPlugin } from "./plugins/html-webpack-plugin.mjs";
import { paths } from "./configuration/paths.mjs";
import { config } from "./configuration/config.mjs";
import { typeScript } from "./modules/scripts.mjs";

const entry = [`${paths.src}/index.ts`];

const output = {
  publicPath: "/",
  path: paths.dist,
  filename: config.JS_FILE_OUTPUT,
};

const plugins = [htmlWebpackPlugin, copyWebpackPlugin];

const modules = {
  rules: [typeScript],
};

const resolve = {
  extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  alias: {
    "@": paths.src,
  },
};

export const WebpackCommonConfig = {
  entry,
  output,
  plugins,
  resolve,
  module: modules,
  context: path.dirname(url.fileURLToPath(import.meta.url)),
  target: config.IS_DEV ? "web" : "browserslist",
  mode: config.IS_DEV ? "development" : "production",
};
