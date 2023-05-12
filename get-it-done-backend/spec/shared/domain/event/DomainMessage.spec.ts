import { expect } from "chai";
import { describe, it } from "mocha";

import { createDomainMessage } from "../../../../src/shared/domain/event/DomainMessage";

describe("Domain Message / createDomainMessage", function () {
  it("creates a message with provided data and current time", function () {
    const originalDateNow = Date.now;
    Date.now = function () {
      return 111;
    };

    const message = createDomainMessage("id", 0, {
      type: "USER_CREATED",
      details: { username: "Joe" },
    });
    expect(typeof message).to.equal("object");
    expect(message.aggregateId).to.equal("id");
    expect(message.playhead).to.equal(0);
    expect(message.event).to.deep.equal({
      type: "USER_CREATED",
      details: { username: "Joe" },
    });
    expect(message.recordedOn).to.equal(111);

    Date.now = originalDateNow;
  });
});
