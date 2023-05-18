import chai, { expect } from "chai";
import { describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import { StateStore, type Action } from "../../src/model/StateStore";

chai.use(sinonChai);

describe("StateStore", () => {
  it("should initialize state", () => {
    const store = new StateStore((state) => {
      if (state === undefined) {
        return "INITIAL STATE";
      } else {
        return "NOT INITIAL STATE";
      }
    });

    expect(store.getState()).to.equal("INITIAL STATE");
  });

  it("should change the state when dispatching an action", () => {
    const store = new StateStore<number, Action<"INCREMENT">>(
      (state = 0, action) => {
        if (action.type === "INCREMENT") {
          return state + 1;
        }
        return state;
      }
    );
    store.dispatch({ type: "INCREMENT" });
    expect(store.getState()).to.equal(1);
  });

  it("should notify listeners of state changes", () => {
    const store = new StateStore<number, Action<"INCREMENT">>(
      (state = 0, action) => {
        if (action.type === "INCREMENT") {
          return state + 1;
        }
        return state;
      }
    );
    store.subscribe((newState) => {
      expect(newState).to.equal(1);
    });
    store.dispatch({ type: "INCREMENT" });
  });

  it("should register a listener only once", function () {
    const store = new StateStore<number, Action<"INCREMENT">>(
      (state = 0, action) => {
        if (action.type === "INCREMENT") {
          return state + 1;
        }
        return state;
      }
    );
    const listener = fake();

    store.subscribe(listener);
    store.subscribe(listener);

    store.dispatch({ type: "INCREMENT" });
    expect(listener).to.have.been.calledOnce;
  });
});
