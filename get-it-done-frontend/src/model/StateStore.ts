/**
 * Interface for actions dispatched to the store
 */
export interface Action<T extends string = string> {
  /** Action type */
  type: T;
}

/**
 * Type for reducers
 */
export type Reducer<S, A extends Action> = (
  state: S | undefined,
  action: A
) => S;

/**
 * Type for state listeners
 */
export type StateListener<S> = (state: S) => void;

/**
 * A store responsible for holding a state, reducing it with actions and notify
 * state changes to listeners
 */
export class StateStore<S, A extends Action> {
  private currentState: S;
  private listeners: Set<StateListener<S>> = new Set();

  /**
   * @param reducer The reducer to user
   */
  constructor(private readonly reducer: Reducer<S, A>) {
    this.currentState = this.reducer(undefined, { type: "@@INIT" } as A);
  }

  /**
   * Get the current state held by this store
   * @returns Current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Add a state listener to the store so it can be called whenever the state
   * changes
   * @param listener The listener
   * @returns a function to unsubscribe
   */
  subscribe(listener: StateListener<S>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Dispatch an action to the store to change the stored state and notify
   * listeners of the new state
   * @param action The action
   */
  dispatch(action: A) {
    this.currentState = this.reducer(this.currentState, action);
    for (const listener of this.listeners) {
      listener(this.currentState);
    }
  }
}
