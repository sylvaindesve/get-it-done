import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import { User } from "../../../src/user/domain/User";

describe("User", function () {
  beforeEach(function () {
    this.originalDateNow = Date.now;
    Date.now = function () {
      return 42;
    };
  });

  afterEach(function () {
    Date.now = this.originalDateNow;
  });

  it("can be instanciateed with a user ID", function () {
    const user = new User("user1");
    expect(user.getAggregateRootId()).to.equal("user1");
  });

  it("can sign up", function () {
    const user = User.signUp("user1", "johndoo", "encrypted password");
    expect(user.getUncommittedEvents()).to.deep.equal([
      {
        aggregateId: "user1",
        playhead: 0,
        recordedOn: 42,
        event: {
          type: "USER SIGNED UP",
          login: "johndoo",
          password: "encrypted password",
        },
      },
    ]);
  });
});
