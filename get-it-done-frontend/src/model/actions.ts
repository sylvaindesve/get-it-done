import type { AppState } from "./reducer";
import type { Action } from "./StateStore";

/**
 * Action to replace the whole state
 */
export interface SetStateAction extends Action<"SET_STATE"> {
  /** The new state */
  state: AppState;
}

/**
 * Creates an action to set the state
 * @param state The new state
 * @returns Action to st the state
 */
export function setState(state: AppState): SetStateAction {
  return {
    type: "SET_STATE",
    state,
  };
}

/**
 * Action to set the JWT token
 */
export interface SetTokenAction extends Action<"SET_TOKEN"> {
  /** The JWT token */
  token: string;
}

/**
 * Creates an action to set the token
 * @param token The JWT token
 * @returns Action to set the token
 */
export function setToken(token: string): SetTokenAction {
  return {
    type: "SET_TOKEN",
    token,
  };
}

/**
 * All possible action types
 */
export type AppAction = SetStateAction | SetTokenAction;
