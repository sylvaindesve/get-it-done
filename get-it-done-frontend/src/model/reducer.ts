import type { Reducer } from "./StateStore";
import type { AppAction } from "./actions";

/**
 * App state interface
 */
export interface AppState {
  /** Connection token */
  token?: string;
}

/**
 * Check if the provided value is a valid application state
 * @param value Anything
 * @returns True if the value is a valid application state
 */
export function isState(value: unknown): value is AppState {
  if (value === null || value === undefined) {
    return false;
  }
  if (!(typeof value === "object")) {
    return false;
  }
  if ("token" in value && !(typeof value.token === "string")) {
    return false;
  }
  return true;
}

const initialState: AppState = {};

export const reducer: Reducer<AppState, AppAction> = (
  state = initialState,
  action
) => {
  if (action.type === "SET_STATE") {
    return action.state;
  }
  if (action.type === "SET_TOKEN") {
    const token = action.token;
    return { ...state, token };
  }
  return state;
};
