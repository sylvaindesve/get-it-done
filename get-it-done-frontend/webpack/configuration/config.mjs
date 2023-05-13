export const config = {
  HOST: "localhost",
  PORT: 9000,
  JS_FILE_OUTPUT: "assets/js/[name].[contenthash].js",
  IS_DEV: process.env.NODE_ENV === "development",
};
