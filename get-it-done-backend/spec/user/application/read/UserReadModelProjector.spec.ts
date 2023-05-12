import { expect } from "chai";
import { describe, it } from "mocha";

import { EventBus } from "../../../../src/shared/domain/event/EventBus";

import { UserReadModelProjector } from "../../../../src/user/application/read/UserReadModelProjector";
import { userSignedUp } from "../../../../src/user/domain/event/UserSignedUp";
import { ReadModelRepository } from "../../../../src/shared/application/read/ReadModelRepository";
import { UserReadModel } from "../../../../src/user/application/read/UserReadModel";
import { createDomainMessage } from "../../../../src/shared/domain/event/DomainMessage";

describe("UserReadModelProjector", function () {
  it("handles user signed up events", async function () {
    const fakeRepository = {
      savedModels: [] as UserReadModel[],
      save: function (userModel: UserReadModel) {
        this.savedModels.push(userModel);
        return Promise.resolve();
      },
    };

    const eventBus = new EventBus();
    const projector = new UserReadModelProjector(
      fakeRepository as unknown as ReadModelRepository<UserReadModel>
    );
    projector.listenTo(eventBus);

    await eventBus.publish([
      createDomainMessage("user1", 0, userSignedUp("johndoo", "secret")),
    ]);

    expect(fakeRepository.savedModels).to.deep.equal([
      {
        id: "user1",
        login: "johndoo",
        password: "secret",
      },
    ]);
  });
});
