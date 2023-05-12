import { expect } from "chai";
import { describe, it } from "mocha";

import { getUserByLogin } from "../../../../src/user/application/query/GetUserByLogin";

describe("GetUserByLogin", function () {
  it("creates a query to get a user by his/her login", function () {
    expect(getUserByLogin("johndoo")).to.deep.equal({
      type: "GET USER BY LOGIN",
      payload: {
        login: "johndoo",
      },
    });
  });
});
