import { expect } from "chai";
import { describe, it } from "mocha";

import {
  USER_SIGNED_UP,
  userSignedUp,
} from "../../../../src/user/domain/event/UserSignedUp";

describe("UserSignedUp / userSignedUp", function () {
  it("créé un événement d'enregistrement d'un utilisateur", function () {
    expect(userSignedUp("johndoo", "encrypted password")).to.deep.equal({
      type: USER_SIGNED_UP,
      login: "johndoo",
      password: "encrypted password",
    });
  });
});
