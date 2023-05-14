import { expect } from "chai";
import { describe, it } from "mocha";

import { setState, setToken } from "../../src/model/actions";

describe("actions", function () {
  describe("setState", function () {
    it("should create a 'set state' action", function () {
      expect(setState({ token: "some token" })).to.deep.equal({
        type: "SET_STATE",
        state: { token: "some token" },
      });
    });
  });

  describe("setToken", function () {
    it("should create a 'set token' action", function () {
      expect(setToken("some token")).to.deep.equal({
        type: "SET_TOKEN",
        token: "some token",
      });
    });
  });
});
