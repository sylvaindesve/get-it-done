import type { BaseView, Controller } from "../../view/base-view";

/**
 * A route configuration
 */
export interface RouteConfig {
  /** The route path */
  path: string;
  /** The function to call when navigating to this route */
  onNavigation: () => void;
}

/**
 * A router controller
 */
export class Router implements Controller {
  private readonly _host: BaseView;

  private _routes: Array<RouteConfig> = [];

  /**
   * @param host The controller host
   * @param routes The routes configuration array
   */
  constructor(host: BaseView, routes: Array<RouteConfig>) {
    this._routes = routes;
    (this._host = host).addController(this);
  }

  /**
   * Navigate to given path
   * @param pathname The path to navigate to
   */
  goto(pathname: string) {
    const route = this._routes.find((r) => r.path === pathname);

    if (route === undefined) {
      throw new Error(`No route found for ${pathname}`);
    }

    route.onNavigation();
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  hostConnected() {
    window.addEventListener("click", this._onClick);
    window.addEventListener("popstate", this._onPopState);
    this.goto(window.location.pathname);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  hostDisconnected() {
    window.removeEventListener("click", this._onClick);
    window.removeEventListener("popstate", this._onPopState);
  }

  private _onClick = (e: MouseEvent) => {
    // Right-clicked or clicked with a key pressed
    const isNonNavigationClick =
      e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;

    if (e.defaultPrevented || isNonNavigationClick) {
      return;
    }

    const anchor = e
      .composedPath()
      .find((n) => (n as HTMLElement).tagName === "A") as
      | HTMLAnchorElement
      | undefined;

    if (
      anchor === undefined ||
      anchor.target !== "" ||
      anchor.hasAttribute("download") ||
      anchor.getAttribute("rel") === "external"
    ) {
      return;
    }

    const href = anchor.href;
    if (href === "" || href.startsWith("mailto:")) {
      return;
    }

    const location = window.location;
    if (anchor.origin !== origin) {
      return;
    }

    e.preventDefault();
    if (href !== location.href) {
      window.history.pushState({}, "", href);
      this.goto(anchor.pathname);
    }
  };

  private _onPopState = () => {
    this.goto(window.location.pathname);
  };
}
