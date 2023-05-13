import CopyWebpackPlugin from "copy-webpack-plugin";

import { paths } from "../configuration/paths.mjs";

export const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: paths.public,
      to: paths.dist,
      globOptions: {
        dot: true,
        ignore: ["**/.DS_Store", "**/.gitkeep", "**/index.html"],
      },
    },
  ],
});
