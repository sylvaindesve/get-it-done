import type { Action } from "./StateStore";

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
export type AppAction = SetTokenAction;
