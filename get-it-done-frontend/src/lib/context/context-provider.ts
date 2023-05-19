import { BaseView } from "../../view/base-view";
import type { Controller } from "../../view/base-view";

import type { ContextRequestEvent } from "./context-request-event";
import type { Context, ContextType } from "./create-context";
import { ValueNotifier } from "./value-notifier";

/**
 * Context provider options
 */
export interface Options<C extends Context<unknown, unknown>> {
  /** The provided context */
  context: C;
  /** The initial value */
  initialValue?: ContextType<C>;
}

/**
 * A context provider controller
 */
export class ContextProvider<T extends Context<unknown, unknown>>
  extends ValueNotifier<ContextType<T>>
  implements Controller
{
  private host: BaseView;
  private context: T;

  /**
   * @param host The controller host
   * @param options Context provider options
   */
  constructor(host: BaseView, options: Options<T>) {
    super(options.initialValue);
    this.host = host;
    this.context = options.context;
    this.attachListeners();
    this.host.addController(this);
  }

  private onContextRequest = (
    ev: ContextRequestEvent<Context<unknown, unknown>>
  ): void => {
    if (ev.context !== this.context || ev.composedPath()[0] === this.host) {
      return;
    }
    ev.stopPropagation();
    this.addCallback(ev.callback, ev.subscribe);
  };

  /**
   * React to context request events
   */
  private attachListeners() {
    this.host.addEventListener("context-request", this.onContextRequest);
  }

  // eslint-disable-next-line
  hostConnected(): void {}
}
