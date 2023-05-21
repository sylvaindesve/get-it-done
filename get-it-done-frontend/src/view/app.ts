/* eslint-disable */

import { ContextProvider, createContext } from "../lib/context";
import type { StateStore } from "../model/StateStore";
import type { AppState } from "../model/reducer";
import { setToken, type AppAction } from "../model/actions";
import { BaseView } from "./base-view";
import { Router } from "../lib/router/router";
import { UserCredentials, UserSignUpRequest } from "./user-credentials";
import type { Backend } from "@/Backend";

export const storeContext = createContext<StateStore<AppState, AppAction>>(
  Symbol("store")
);

export class App extends BaseView {
  static override get style() {
    return `
    :host {
      display: block;
    }

    ul {
      display: flex;
      list-style: none;
    }

    li {
      padding: 1rem;
    }
    `;
  }

  static override get template() {
    return `
    <ul>
      <li>
        <a part="menu-link" href="/">Home</a>
      </li>
      <li>
        <a part="menu-link" href="/signup">Sign up</a>
      </li>
      <li>
        <a part="menu-link" href="/signin">Sign in</a>
      </li>
      <li>
        <a part="menu-link" href="/tasks">Tasks</a>
      </li>
    </ul>
    <p id="error"></p>
    <slot></slot>
    `;
  }

  private store: ContextProvider<typeof storeContext>;
  private backend: Backend;
  private router: Router;

  private errorParagraph!: HTMLParagraphElement;

  constructor(store: StateStore<AppState, AppAction>, backend: Backend) {
    super();
    this.store = new ContextProvider(this, {
      context: storeContext,
      initialValue: store,
    });
    this.backend = backend;
    this.router = new Router(this, [
      {
        path: "/",
        onNavigation: this.renderHomePage,
      },
      {
        path: "/signup",
        onNavigation: this.renderSignUpPage,
      },
      {
        path: "/signin",
        onNavigation: this.renderSignInPage,
      },
      {
        path: "/tasks",
        onNavigation: () => console.log("tasks"),
      },
    ]);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.errorParagraph = this.renderRoot.querySelector("#error")!;
    this.attachListeners();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.detachListeners();
  }

  private renderHomePage = () => {
    this.replaceChildren();
  };

  private renderSignUpPage = () => {
    this.replaceChildren();
    const signUpForm = new UserCredentials();
    signUpForm.mode = "signup";
    this.appendChild(signUpForm);
  };

  private renderSignInPage = () => {
    console.log("signin");
    this.replaceChildren();
    const signInForm = new UserCredentials();
    this.appendChild(signInForm);
  };

  private attachListeners() {
    this.addEventListener("user-signup-request", this.onSignUpRequest);
  }

  private detachListeners() {
    this.removeEventListener("user-signup-request", this.onSignUpRequest);
  }

  private onSignUpRequest = async (event: UserSignUpRequest) => {
    const { login, password } = event;
    try {
      const { token } = await this.backend.signup(login, password);
      this.store.value.dispatch(setToken(token));
      this.router.goto("/");
    } catch (error) {
      this.errorParagraph.innerHTML = (error as Error).message;
    }
  };
}

if (!window.customElements.get("gid-app")) {
  window.customElements.define("gid-app", App);
}
