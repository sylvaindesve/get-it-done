import { beforeEach, describe, it } from "mocha";

import { connectUserDomain } from "../../../src/user/application/connectUserDomain";
import { EventBus } from "../../../src/shared/domain/event/EventBus";
import { CommandBus } from "../../../src/shared/application/command/CommandBus";
import { QueryBus } from "../../../src/shared/application/query/QueryBus";
import { UserRepository } from "../../../src/user/domain/UserRepository";
import { UserReadModelRepository } from "../../../src/user/application/read/UserReadModelRepository";

describe("connectUserDomain", function () {
  beforeEach(function () {
    this.fakeEventBus = {};
    this.fakeCommandBus = {};
    this.fakeQueryBus = {};
    this.fakeUserRepository = {};
    this.fakeUserReadModelRepository = {};
    connectUserDomain({
      eventBus: this.fakeEventBus as EventBus,
      commandBus: this.fakeCommandBus as CommandBus,
      queryBus: this.fakeQueryBus as QueryBus,
      userRepository: this.fakeUserRepository as UserRepository,
      userReadModelRepository: this
        .fakeUserReadModelRepository as UserReadModelRepository,
    });
  });

  it("connects the user commands handler");

  it("connects the user read model projector");

  it("connects the user queries handler");
});
