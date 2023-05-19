import type { BaseView, Controller } from "../../view/base-view";

import type { Context, ContextType } from "./createContext";
import {
  ContextRequestEvent,
  type ContextCallback,
} from "./ContextRequestEvent";

/**
 * Context consumer options
 */
export interface Options<C extends Context<unknown, unknown>> {
  /** The context */
  context: C;
  /** Optional callback to call with value */
  callback?: (value: ContextType<C>, dispose?: () => void) => void;
  /** If the consumer should listen to context value changes */
  subscribe?: boolean;
}

/**
 * Controller to consume a context
 */
export class ContextConsumer<C extends Context<unknown, unknown>>
  implements Controller
{
  private host: BaseView;
  private context: C;
  private callback?: (value: ContextType<C>, dispose?: () => void) => void;
  private subscribe = false;

  private provided = false;

  public value?: ContextType<C> = undefined;

  /**
   * @param host the controller host
   * @param options context consumer options
   */
  constructor(host: BaseView, options: Options<C>) {
    this.host = host;
    this.context = options.context;
    this.callback = options.callback;
    this.subscribe = options.subscribe ?? false;
    this.host.addController(this);
  }

  private unsubscribe?: () => void;

  // eslint-disable-next-line jsdoc/require-jsdoc
  hostConnected(): void {
    this.host.dispatchEvent(
      new ContextRequestEvent(this.context, this._callback, this.subscribe)
    );
  }

  private _callback: ContextCallback<ContextType<C>> = (value, unsubscribe) => {
    if (this.unsubscribe) {
      if (this.unsubscribe !== unsubscribe) {
        this.provided = false;
        this.unsubscribe();
      }
      if (!this.subscribe) {
        this.unsubscribe();
      }
    }

    this.value = value;

    if (!this.provided || this.subscribe) {
      this.provided = true;
      if (this.callback) {
        this.callback(value, unsubscribe);
      }
    }

    this.unsubscribe = unsubscribe;
  };
}
