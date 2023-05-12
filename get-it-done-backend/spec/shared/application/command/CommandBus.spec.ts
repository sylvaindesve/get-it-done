import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import { Command } from "../../../../src/shared/application/command/Command";
import { CommandBus } from "../../../../src/shared/application/command/CommandBus";

describe("CommandBus", function () {
  beforeEach(function () {
    this.bus = new CommandBus();
  });

  it("dispatch the command to the subscribed handler", async function () {
    (this.bus as CommandBus).subscribe("TEST", (command: Command) => {
      return Promise.resolve(command.payload);
    });
    const result = await this.bus.dispatch({
      type: "TEST",
      payload: "SOME PAYLOAD",
    });
    expect(result).to.equal("SOME PAYLOAD");
  });

  it("throws an error if an handler is already subcribed", async function () {
    (this.bus as CommandBus).subscribe("TEST", () => {
      return Promise.resolve();
    });

    expect(() => {
      (this.bus as CommandBus).subscribe("TEST", () => {
        return Promise.resolve();
      });
    }).to.throw(`Handler already registered for command type 'TEST'`);
  });

  it("throws an error if there is no handler", function () {
    expect(() => {
      (this.bus as CommandBus).dispatch({
        type: "TEST",
        payload: "SOME PAYLOAD",
      });
    }).to.throw(`No handler for command type 'TEST'`);
  });
});
