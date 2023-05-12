import { expect } from "chai";
import { describe, it } from "mocha";

import { createDomainEvent } from "../../../../src/shared/domain/event/DomainEvent";

describe("DomainEvent / createDomainEvent", function () {
  it("can create and event with type and details", function () {
    const event = createDomainEvent("UserCreated", { username: "Joe" });
    expect(event.type).to.equal("UserCreated");
    expect(event.details).to.deep.equal({ username: "Joe" });
  });

  it("can create and event with a type and no details", function () {
    const event = createDomainEvent("UserCreated");
    expect(event).to.deep.equal({ type: "UserCreated" });
  });
});
