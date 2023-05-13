interface Route {
  path: string;
}

type RouteListener = (route: Route, routerElement: Router) => void;

/**
 * A router component.
 * All child elements with a `route` attribute will trigger a navigation to
 * the `route` attribute value when clicked. Navigation will actually occurs
 * if there is a corresponding route listener attached to the router.
 */
export class Router extends HTMLElement {
  private routeListeners: { [path: string]: RouteListener } = {};

  // eslint-disable-next-line jsdoc/require-jsdoc
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handlePopstate = this.handlePopstate.bind(this);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  connectedCallback() {
    this.navigate(window.location.pathname);
    this.addEventListener("click", this.handleClick);
    window.addEventListener("popstate", this.handlePopstate);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("popstate", this.handlePopstate);
  }

  /**
   * Register a route listener to this router.
   * @param path The path to listen to
   * @param listener The listener to call
   */
  addRouteListener(path: string, listener: RouteListener) {
    if (path in this.routeListeners) {
      throw `Path '${path}' already registered`;
    } else {
      this.routeListeners[path] = listener;
    }
  }

  /**
   * Navigate to the povided path if there is a corresponding route listener
   * @param path The patch to navigate to
   */
  navigate(path: string) {
    if (path in this.routeListeners) {
      window.history.pushState(null, "", path);
      this.routeListeners[path]({ path }, this);
    }
  }

  /**
   * Handles click events so that it can trigger navigation if appropriate
   * @param event Click event
   */
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

  /**
   * Handles `popstate` events so that the browser `back` action still function
   */
  private handlePopstate() {
    this.navigate(window.location.pathname);
  }
}

if (!window.customElements.get("gid-router")) {
  window.customElements.define("gid-router", Router);
}
