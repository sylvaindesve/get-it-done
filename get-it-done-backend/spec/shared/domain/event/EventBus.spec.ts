import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import {
  DomainMessage,
  createDomainMessage,
} from "../../../../src/shared/domain/event/DomainMessage";
import { EventBus } from "../../../../src/shared/domain/event/EventBus";
import { DomainEvent } from "../../../../src/shared/domain/event/DomainEvent";

describe("EventBus", function () {
  beforeEach(function () {
    this.bus = new EventBus();
  });

  it("publish events to listeners", async function () {
    const listener = {
      results: [] as DomainEvent[],
      handleUserCreated: function (message: DomainMessage) {
        this.results.push(message.event);
      },
      handleRenamed: function (message: DomainMessage) {
        this.results.push(message.event);
      },
    };

    (this.bus as EventBus).subscribe(
      "UserCreated",
      listener.handleUserCreated.bind(listener)
    );
    (this.bus as EventBus).subscribe(
      "UserRenamed",
      listener.handleRenamed.bind(listener)
    );

    await (this.bus as EventBus).publish([
      createDomainMessage("user1", 0, { type: "UserCreated" }),
      createDomainMessage("user1", 1, {
        type: "UserRenamed",
        username: "John Doo",
      }),
    ]);

    expect(listener.results).to.deep.equal([
      { type: "UserCreated" },
      { type: "UserRenamed", username: "John Doo" },
    ]);
  });

  it("don't call unconcerned listeners", async function () {
    const listener = {
      results: [] as DomainEvent[],
      handleUserCreated: function (message: DomainMessage) {
        this.results.push(message.event);
      },
    };

    (this.bus as EventBus).subscribe(
      "UserCreated",
      listener.handleUserCreated.bind(listener)
    );

    await (this.bus as EventBus).publish([
      createDomainMessage("user1", 1, {
        type: "UserRenamed",
        username: "John Doo",
      }),
    ]);

    expect(listener.results).to.deep.equal([]);
  });

  it("can register several listeners for the same event type", async function () {
    const listener = {
      results: [] as Array<{ who: string; what: DomainEvent }>,
      handleFirst: function (message: DomainMessage) {
        this.results.push({ who: "first", what: message.event });
      },
      handleSecond: function (message: DomainMessage) {
        this.results.push({ who: "second", what: message.event });
      },
    };

    this.bus.subscribe("UserCreated", listener.handleFirst.bind(listener));
    this.bus.subscribe("UserCreated", listener.handleSecond.bind(listener));

    await this.bus.publish([
      createDomainMessage("user1", 0, { type: "UserCreated" }),
    ]);

    expect(listener.results).to.deep.equal([
      { who: "first", what: { type: "UserCreated" } },
      { who: "second", what: { type: "UserCreated" } },
    ]);
  });
});
