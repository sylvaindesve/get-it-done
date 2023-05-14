import type { Reducer } from "./StateStore";
import type { AppAction } from "./actions";

/**
 * App state interface
 */
export interface State {
  /** Connection token */
  token?: string;
}

const initialState: State = {};

export const reducer: Reducer<State, AppAction> = (
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
