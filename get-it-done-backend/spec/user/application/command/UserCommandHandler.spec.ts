import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import { signUpUser } from "../../../../src/user/application/command/SignUpUser";
import { UserCommandHandler } from "../../../../src/user/application/command/UserCommandHandler";
import { CommandBus } from "../../../../src/shared/application/command/CommandBus";
import { DomainMessage } from "../../../../src/shared/domain/event/DomainMessage";
import { UserRepository } from "../../../../src/user/domain/UserRepository";
import { User } from "../../../../src/user/domain/User";

describe("UserCommandHandler", function () {
  beforeEach(function () {
    this.originalDateNow = Date.now;
    Date.now = function () {
      return 42;
    };
  });

  afterEach(function () {
    Date.now = this.originalDateNow;
  });

  it("handles sign up user commands", async function () {
    const fakeRepository = {
      savedEvents: [] as DomainMessage[],
      hasLogin: function () {
        return Promise.resolve(false);
      },
      save: function (user: User) {
        this.savedEvents.push(...user.getUncommittedEvents());
        return Promise.resolve();
      },
    };

    const commandBus = new CommandBus();
    const handler = new UserCommandHandler(
      fakeRepository as unknown as UserRepository
    );
    handler.listenTo(commandBus);

    const userId = await commandBus.dispatch(
      signUpUser("johndoo", "encrypted password")
    );

    expect(typeof userId).to.equal("string");
    expect(fakeRepository.savedEvents).to.deep.equal([
      {
        aggregateId: userId,
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
