import { expect } from "chai";
import { describe, it } from "mocha";

import { setToken, type AppAction, setState } from "../../src/model/actions";
import { reducer } from "../../src/model/reducer";

function createState() {
  return {
    token: "initial token",
  };
}

describe("reducer", function () {
  it("should initialize with no token", function () {
    const initialState = reducer(undefined, {
      type: "@@INIT",
    } as unknown as AppAction);
    expect(initialState).to.deep.equal({});
  });

  describe("setting the state", function () {
    it("should replace the state", function () {
      const initialState = createState();
      const newState = reducer(initialState, setState({ token: "some token" }));
      expect(newState).to.deep.equal({ token: "some token" });
    });

    it("should not change the initial state", function () {
      const initialState = createState();
      reducer(initialState, setState({ token: "some token" }));
      expect(initialState).to.deep.equal(createState());
    });
  });

  describe("setting the token", function () {
    it("should set the token", function () {
      const initialState = createState();
      const newState = reducer(initialState, setToken("some token"));
      expect(newState).to.deep.equal({
        ...initialState,
        token: "some token",
      });
    });

    it("should not change the initial state", function () {
      const initialState = createState();
      reducer(initialState, setToken("some token"));
      expect(initialState).to.deep.equal(createState());
    });
  });
});
