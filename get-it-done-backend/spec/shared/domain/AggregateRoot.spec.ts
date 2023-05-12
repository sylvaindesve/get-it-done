/* eslint-disable require-jsdoc */
import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import { createDomainMessage } from "../../../src/shared/domain/event/DomainMessage";
import { AggregateRoot } from "../../../src/shared/domain/AggregateRoot";
import { DomainEvent } from "../../../src/shared/domain/event/DomainEvent";

interface UserRenamed extends DomainEvent {
  type: "UserRenamed";
  username: string;
}

interface UserEmailChanged extends DomainEvent {
  type: "UserEmailChanged";
  email: string;
}

class User extends AggregateRoot {
  public username = "";
  public email = "";
  constructor(userId: string) {
    super(userId);
    this.addEventHandler("UserRenamed", (event: UserRenamed) => {
      this.username = event.username;
    });
    this.addEventHandler("UserEmailChanged", (event: UserEmailChanged) => {
      this.email = event.email;
    });
  }
}

describe("AggregateRoot", function () {
  beforeEach(function () {
    this.originalDateNow = Date.now;
    Date.now = function () {
      return 42;
    };
  });

  afterEach(function () {
    Date.now = this.originalDateNow;
  });

  it("has and ID", function () {
    const user = new User("user1");
    expect(user.getAggregateRootId()).to.equal("user1");
  });

  it("can apply events", function () {
    const user = new User("user1");
    expect(user.getUncommittedEvents()).to.deep.equal([]);

    const userCreated = { type: "UserCreated" };
    const userRenamed = { type: "UserRenamed", username: "John Doo" };
    const userEmailChanged = {
      type: "UserEmailChanged",
      email: "john.doo@company.com",
    };

    user.apply(userCreated);
    user.apply(userRenamed);
    user.apply(userEmailChanged);

    expect(user.getUncommittedEvents()).to.deep.equal([
      {
        aggregateId: "user1",
        playhead: 0,
        recordedOn: 42,
        event: { type: "UserCreated" },
      },
      {
        aggregateId: "user1",
        playhead: 1,
        recordedOn: 42,
        event: { type: "UserRenamed", username: "John Doo" },
      },
      {
        aggregateId: "user1",
        playhead: 2,
        recordedOn: 42,
        event: {
          type: "UserEmailChanged",
          email: "john.doo@company.com",
        },
      },
    ]);

    expect(user.getUncommittedEvents()).to.deep.equal([]);
  });

  it("initialize its state with events", function () {
    const user = new User("user1");

    const userCreated = createDomainMessage("user1", 0, {
      type: "UserCreated",
    });
    const userRenamed = createDomainMessage("user1", 1, {
      type: "UserRenamed",
      username: "John Doo",
    });
    const userEmailChanged = createDomainMessage("user1", 2, {
      type: "UserEmailChanged",
      email: "john.doo@company.com",
    });

    user.initializeState([userCreated, userRenamed, userEmailChanged]);

    expect(user.getUncommittedEvents()).to.deep.equal([]);
    expect(user.username).to.equal("John Doo");
    expect(user.email).to.equal("john.doo@company.com");

    user.apply({ type: "UserRenamed", username: "Bill Doo" });
    const uncommittedEvents = user.getUncommittedEvents();
    expect(uncommittedEvents.length).to.equal(1);
    expect(uncommittedEvents[0].playhead).to.equal(3);
  });
});
