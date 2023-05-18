import type { ContextType, Context } from "./createContext.js";

declare global {
  interface HTMLElementEventMap {
    "context-request": ContextRequestEvent<Context<unknown, unknown>>;
  }
}

/**
 * A callback which is provided by a context requester and is called with the
 * value satisfying the request. This callback can be called multiple times by
 * context providers as the requested value is changed.
 */
export type ContextCallback<ValueType> = (
  value: ValueType,
  unsubscribe?: () => void
) => void;

/**
 * Interface for a context request
 */
export interface ContextRequest<C extends Context<unknown, unknown>> {
  /** The context key to request */
  readonly context: C;
  /**
   * The callback that should be invoked when the context with the specified
   * key is available
   */
  readonly callback: ContextCallback<ContextType<C>>;
  /**
   * An optional argument, if true indicates we want to subscribe to future
   * updates
   */
  readonly subscribe?: boolean;
}

/**
 * An event fired by a context requester to signal it desires a specified
 * context with the given key.
 *
 * A provider should inspect the `context` property of the event to determine if
 * it has a value that can satisfy the request, calling the `callback` with the
 * requested value if so.
 *
 * If the requested context event contains a truthy `subscribe` value, then a
 * provider can call the callback multiple times if the value is changed, if
 * this is the case the provider should pass an `unsubscribe` method to the
 * callback which consumers can invoke to indicate they no longer wish to
 * receive these updates.
 *
 * If no `subscribe` value is present in the event, then the provider can assume
 * that this is a 'one time' request for the context and can therefore not track
 * the consumer.
 */
export class ContextRequestEvent<C extends Context<unknown, unknown>>
  extends Event
  implements ContextRequest<C>
{
  /**
   * @param context the context key to request
   * @param callback the callback that should be invoked when the context with
   *  the specified key is available
   * @param subscribe an optional argument, if true indicates we want to
   *  subscribe to future updates
   */
  public constructor(
    public readonly context: C,
    public readonly callback: ContextCallback<ContextType<C>>,
    public readonly subscribe?: boolean
  ) {
    super("context-request", { bubbles: true, composed: true });
  }
}
