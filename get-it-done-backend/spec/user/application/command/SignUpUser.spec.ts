import { expect } from "chai";
import { describe, it } from "mocha";

import { signUpUser } from "../../../../src/user/application/command/SignUpUser";

describe("SignUpUser / signUpUser", function () {
  it("creates a command to sign up a new user", function () {
    expect(signUpUser("johndoo", "encrypted password")).to.deep.equal({
      type: "SIGN UP USER",
      payload: {
        login: "johndoo",
        password: "encrypted password",
      },
    });
  });
});
