/**
 * View controller interface
 */
export interface Controller {
  /** Called when the host is connected to the DOM */
  hostConnected?(): void;
  /** Called when the host is disconnected from the DOM */
  hostDisconnected?(): void;
}

/**
 * Abstract base class for all views
 */
export abstract class BaseView extends HTMLElement {
  /**
   * The view template to override in derived classes
   * @returns the template of the view as a string
   */
  static get template() {
    return `<slot></slot>`;
  }

  /**
   * The CSS styles to override in derived classes
   * @returns CSS styles forr the view as a string
   */
  static get style() {
    return ``;
  }

  private static _templateElement: HTMLTemplateElement | null;

  /**
   * Creates or get the template element for this view
   * @returns the template element
   */
  private static _createOrGetTemplateElement() {
    if (!this._templateElement) {
      this._templateElement = document.createElement("template");
      this._templateElement.innerHTML = `<style>${this.style}</style>${this.template}`;
    }
    return this._templateElement;
  }

  readonly renderRoot!: ShadowRoot;
  private _controllers?: Controller[];

  /**
   * Add a controller to the list of controllers for this  view
   * @param controller the controller to add
   */
  addController(controller: Controller): void {
    (this._controllers ??= []).push(controller);
    if (this.isConnected) {
      controller.hostConnected?.();
    }
  }

  /**
   * Remove a controller from the list of controllers for this view
   * @param controller the controller to remove
   */
  removeController(controller: Controller) {
    this._controllers?.splice(this._controllers.indexOf(controller) >>> 0, 1);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  connectedCallback() {
    if (this.renderRoot === undefined) {
      const renderRoot = this.attachShadow({ mode: "open" });

      const tmp = (
        this.constructor as typeof BaseView
      )._createOrGetTemplateElement();
      renderRoot.appendChild(tmp.content.cloneNode(true));

      (this as { renderRoot: ShadowRoot }).renderRoot = renderRoot;
    }
    this._controllers?.forEach((c) => c.hostConnected?.());
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  disconnectedCallback() {
    this._controllers?.forEach((c) => c.hostDisconnected?.());
  }
}
