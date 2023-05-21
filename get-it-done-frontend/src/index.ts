import { Backend } from "./Backend";
import { StateStore } from "./model/StateStore";
import { reducer } from "./model/reducer";
import { App } from "./view/app";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    const store = new StateStore(reducer);
    const backend = new Backend(fetch.bind(this));
    const app = new App(store, backend);
    root.appendChild(app);
  }
});
