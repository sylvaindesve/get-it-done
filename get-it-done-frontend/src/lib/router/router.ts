/* eslint-disable */

import type { BaseView, Controller } from "../../view/base-view";

export interface RouteConfig {
  path: string;
  onNavigation: () => void;
}

export class Router implements Controller {
  private readonly _host: BaseView;

  private _routes: Array<RouteConfig> = [];

  constructor(host: BaseView, routes: Array<RouteConfig>) {
    this._routes = routes;
    (this._host = host).addController(this);
  }

  goto(pathname: string) {
    const route = this._routes.find((r) => r.path === pathname);

    if (route === undefined) {
      throw new Error(`No route found for ${pathname}`);
    }

    route.onNavigation();
  }

  hostConnected() {
    window.addEventListener("click", this._onClick);
    window.addEventListener("popstate", this._onPopState);
    this.goto(window.location.pathname);
  }

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

  private _onPopState = (_e: PopStateEvent) => {
    this.goto(window.location.pathname);
  };
}
