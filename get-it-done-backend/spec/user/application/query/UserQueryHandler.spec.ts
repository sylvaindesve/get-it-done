import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import { QueryBus } from "../../../../src/shared/application/query/QueryBus";
import { UserQueryHandler } from "../../../../src/user/application/query/UserQueryHandler";
import { getUserByLogin } from "../../../../src/user/application/query/GetUserByLogin";
import { UserReadModelRepository } from "../../../../src/user/application/read/UserReadModelRepository";

describe("UserQueryHandler", function () {
  beforeEach(function () {
    this.queryBus = new QueryBus();
  });

  describe("handleGetUser", function () {
    it("returns the user with the provided login", async function () {
      this.fakeRepository = {
        findByLogin: function () {
          return Promise.resolve({
            id: "user1",
            login: "johndoo",
            password: "secret",
          });
        },
      };

      const handler = new UserQueryHandler(
        this.fakeRepository as unknown as UserReadModelRepository
      );
      handler.listenTo(this.queryBus);

      const user = await this.queryBus.dispatch(getUserByLogin("johndoo"));
      expect(user).to.deep.equal({
        id: "user1",
        login: "johndoo",
        password: "secret",
      });
    });

    it("returns null if no user exists with this login", async function () {
      this.fakeRepository = {
        findByLogin: function () {
          return Promise.resolve(null);
        },
      };

      const handler = new UserQueryHandler(
        this.fakeRepository as unknown as UserReadModelRepository
      );
      handler.listenTo(this.queryBus);

      const user = await this.queryBus.dispatch(getUserByLogin("johndoo"));
      expect(user).to.be.null;
    });
  });
});
