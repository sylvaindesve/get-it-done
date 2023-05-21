/* eslint-disable */

import { BaseView } from "./base-view";

declare global {
  interface HTMLElementEventMap {
    "user-signup-request": UserSignUpRequest;
    "user-signin-request": UserSignInRequest;
  }

  interface HTMLElementTagNameMap {
    "gid-user-credentials": UserCredentials;
  }
}

export class UserSignUpRequest extends Event {
  constructor(public readonly login: string, public readonly password: string) {
    super("user-signup-request", { bubbles: true, composed: true });
  }
}

export class UserSignInRequest extends Event {
  constructor(public readonly login: string, public readonly password: string) {
    super("user-signin-request", { bubbles: true, composed: true });
  }
}

type UserCredentialsMode = "signin" | "signup";

export class UserCredentials extends BaseView {
  static override get template() {
    return `
    <label for="login">Login</label>
    <input id="login" type="text" name="login" />
    <label for="password">Password</label>
    <input id="password" type="password" name="password" />
    <button id="submit">Sign in</button>
    <p id="error"></p>
    `;
  }

  static get observedAttributes() {
    return ["mode"];
  }

  private loginInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private passwordConfirmLabel!: HTMLLabelElement;
  private passwordConfirmInput!: HTMLInputElement;
  private submitButton!: HTMLButtonElement;
  private errorParagraph!: HTMLParagraphElement;

  get mode(): UserCredentialsMode {
    return this.hasAttribute("mode") && this.getAttribute("mode") === "signup"
      ? "signup"
      : "signin";
  }

  set mode(value: UserCredentialsMode) {
    if (!["signin", "signup"].includes(value)) {
      this.setAttribute("mode", "signin");
    } else {
      this.setAttribute("mode", value);
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.loginInput = this.renderRoot.querySelector("#login")!;
    this.passwordInput = this.renderRoot.querySelector("#password")!;
    this.passwordConfirmLabel = this.createPasswordConfirmLabel();
    this.passwordConfirmInput = this.createPasswordConfirmInput();
    this.submitButton = this.renderRoot.querySelector("#submit")!;
    this.errorParagraph = this.renderRoot.querySelector("#error")!;
    this.update();
    this.attachListeners();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.detachListeners();
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected) return;

    if (name === "mode") {
      this.update();
    }
  }

  private update() {
    if (this.mode === "signup") {
      this.submitButton.innerHTML = "Sign up";
      if (!this.passwordConfirmLabel.isConnected) {
        this.renderRoot.insertBefore(
          this.passwordConfirmLabel,
          this.submitButton
        );
      }
      if (!this.passwordConfirmInput.isConnected) {
        this.renderRoot.insertBefore(
          this.passwordConfirmInput,
          this.submitButton
        );
      }
    } else {
      this.submitButton.innerHTML = "Sign in";
      if (this.passwordConfirmLabel.isConnected) {
        this.renderRoot.removeChild(this.passwordConfirmLabel);
      }
      if (this.passwordConfirmInput.isConnected) {
        this.renderRoot.removeChild(this.passwordConfirmInput);
      }
    }
  }

  private attachListeners() {
    this.submitButton.addEventListener("click", this.onSubmit);
  }

  private detachListeners() {
    this.submitButton.removeEventListener("click", this.onSubmit);
  }

  private onSubmit = (_ev: MouseEvent) => {
    if (this.mode === "signup") {
      if (this.passwordConfirmInput.value === this.passwordInput.value) {
        this.dispatchEvent(
          new UserSignUpRequest(this.loginInput.value, this.passwordInput.value)
        );
      } else {
        this.errorParagraph.innerHTML = `Password and confirmation don't match`;
        this.passwordConfirmInput.value = "";
      }
    } else {
      this.dispatchEvent(
        new UserSignInRequest(this.loginInput.value, this.passwordInput.value)
      );
    }
  };

  private createPasswordConfirmInput() {
    const passwordConfirmInput = document.createElement("input");
    passwordConfirmInput.setAttribute("id", "password-confirm");
    passwordConfirmInput.setAttribute("name", "password-confirm");
    passwordConfirmInput.setAttribute("type", "password");
    return passwordConfirmInput;
  }

  private createPasswordConfirmLabel() {
    const passwordConfirmLabel = document.createElement("label");
    passwordConfirmLabel.setAttribute("for", "password-confirm");
    passwordConfirmLabel.innerHTML = "Confirm";
    return passwordConfirmLabel;
  }
}

if (!window.customElements.get("gid-user-credentials")) {
  window.customElements.define("gid-user-credentials", UserCredentials);
}
