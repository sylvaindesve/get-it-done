import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const paths = {
  src: path.resolve(__dirname, "../../src"), // Source directory.
  dist: path.resolve(__dirname, "../../dist"), // Destination build directory.
  public: path.resolve(__dirname, "../../public"), // Public directory
};
