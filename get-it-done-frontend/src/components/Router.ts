interface Route {
  path: string;
}

type RouteListener = (route: Route, routerElement: Router) => void;

export class Router extends HTMLElement {
  private routeListeners: { [path: string]: RouteListener } = {};

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handlePopstate = this.handlePopstate.bind(this);
  }

  connectedCallback() {
    this.navigate(window.location.pathname);
    this.addEventListener("click", this.handleClick);
    window.addEventListener("popstate", this.handlePopstate);
  }

  addRouteListener(path: string, listener: RouteListener) {
    if (path in this.routeListeners) {
      throw `Path '${path}' already registered`;
    } else {
      this.routeListeners[path] = listener;
    }
  }

  navigate(path: string) {
    if (path in this.routeListeners) {
      window.history.pushState(null, "", path);
      this.routeListeners[path]({ path }, this);
    }
  }

  private handleClick(event: MouseEvent) {
    const clicked = event.target;
    if (
      clicked &&
      clicked instanceof Element &&
      clicked.hasAttribute("route")
    ) {
      event.preventDefault();
      const path = clicked.getAttribute("route") as string;
      this.navigate(path);
    }
  }

  private handlePopstate() {
    this.navigate(window.location.pathname);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("popstate", this.handlePopstate);
  }
}

if (!window.customElements.get("gid-router")) {
  window.customElements.define("gid-router", Router);
}
