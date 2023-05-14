import { expect } from "chai";
import { describe, it } from "mocha";

import { setToken, type AppAction, setState } from "../../src/model/actions";
import { isState, reducer } from "../../src/model/reducer";

function createState() {
  return {
    token: "initial token",
  };
}

describe("reducer", function () {
  describe("isState", function () {
    it("should returns false for null or undefined", function () {
      expect(isState(null)).to.be.false;
      expect(isState(undefined)).to.be.false;
    });

    it("should returns false for non-objects", function () {
      expect(isState(3), "true for number").to.be.false;
      expect(isState("thing"), "true for string").to.be.false;
      expect(
        isState(() => {
          return;
        }),
        "true for function"
      ).to.be.false;
    });

    it("should return false if 'token' is not a string", function () {
      expect(isState({ token: 3 }), "true for number").to.be.false;
      expect(isState({ token: {} }), "true for object").to.be.false;
      expect(
        isState({
          token: () => {
            return;
          },
        }),
        "true for function"
      ).to.be.false;
    });

    it("should return true for a valid state", function () {
      expect(isState({ token: "some token" })).to.be.true;
    });
  });
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
