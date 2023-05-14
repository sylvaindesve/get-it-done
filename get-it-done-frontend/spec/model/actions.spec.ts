import { expect } from "chai";
import { describe, it } from "mocha";

import { setToken } from "../../src/model/actions";

describe("actions", function () {
  describe("setToken", function () {
    it("should create a 'set token' action", function () {
      expect(setToken("some token")).to.deep.equal({
        type: "SET_TOKEN",
        token: "some token",
      });
    });
  });
});
