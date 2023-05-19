import type { ContextCallback } from "./context-request-event.js";

/** Dispose function */
type Disposer = () => void;

/**
 * A simple class which stores a value, and triggers registered callbacks when
 * the value is changed via its setter.
 */
export class ValueNotifier<T> {
  private callbacks: Map<ContextCallback<T>, Disposer> = new Map();

  private _value!: T;

  /**
   * @returns The value stored
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Setter for the value
   * @param v The new value
   */
  public set value(v: T) {
    this.setValue(v);
  }

  /**
   * Sets a new value and notify observers if it actually changed
   * @param v The new value
   * @param force true to force notifications
   */
  public setValue(v: T, force = false) {
    const update = force || !Object.is(v, this._value);
    this._value = v;
    if (update) {
      this.updateObservers();
    }
  }

  /**
   * @param defaultValue The default value
   */
  constructor(defaultValue?: T) {
    if (defaultValue !== undefined) {
      this.value = defaultValue;
    }
  }

  /**
   * Notify all observers
   */
  updateObservers = (): void => {
    for (const [callback, disposer] of this.callbacks) {
      callback(this._value, disposer);
    }
  };

  /**
   * Register a callback
   * @param callback The callback to call when the value changees
   * @param subscribe False if the callback should be called only once
   */
  addCallback(callback: ContextCallback<T>, subscribe?: boolean): void {
    if (subscribe) {
      if (!this.callbacks.has(callback)) {
        this.callbacks.set(callback, () => {
          this.callbacks.delete(callback);
        });
      }
    }
    callback(this.value);
  }

  /**
   * Remove all callbacks
   */
  clearCallbacks(): void {
    this.callbacks.clear();
  }
}
