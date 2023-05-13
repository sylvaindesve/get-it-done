import { WebpackDevConfig } from "./webpack/dev.mjs";
import { WebpackProdConfig } from "./webpack/prod.mjs";
import { config } from "./webpack/configuration/config.mjs";

// TODO Add PROD configuration
export default config.IS_DEV ? WebpackDevConfig : WebpackProdConfig;
