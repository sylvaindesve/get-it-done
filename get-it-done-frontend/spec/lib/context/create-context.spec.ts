import { expect } from "chai";
import { describe, it } from "mocha";

import { createContext } from "../../../src/lib/context";

describe("createContext", function () {
  it("creates a context", function () {
    const sym = Symbol("my-context");
    expect(createContext(sym)).to.equal(sym);
  });
});
