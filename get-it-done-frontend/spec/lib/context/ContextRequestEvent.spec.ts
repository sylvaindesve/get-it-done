import { describe, it } from "mocha";
import { ContextRequestEvent, createContext } from "../../../src/lib/context";
import { expect } from "chai";

function createEvent() {
  return new ContextRequestEvent(
    createContext(Symbol("my-context")),
    () => {
      return;
    },
    false
  );
}

describe("ContextRequestEvent", function () {
  it("has an event type of 'context-request'", function () {
    const event = createEvent();
    expect(event.type).to.equal("context-request");
  });

  it("is bubbling", function () {
    const event = createEvent();
    expect(event.bubbles).to.be.true;
  });

  it("is composed", function () {
    const event = createEvent();
    expect(event.composed).to.be.true;
  });
});
