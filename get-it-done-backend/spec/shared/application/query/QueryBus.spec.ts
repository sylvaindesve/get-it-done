import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";

import { Query } from "../../../../src/shared/application/query/Query";
import { QueryBus } from "../../../../src/shared/application/query/QueryBus";

describe("QueryBus", function () {
  beforeEach(function () {
    this.bus = new QueryBus();
  });

  it("dispatch the query to the subscribed handler", async function () {
    (this.bus as QueryBus).subscribe("TEST", (query: Query) => {
      return Promise.resolve(query.payload);
    });
    const result = await this.bus.dispatch({
      type: "TEST",
      payload: "SOME PAYLOAD",
    });
    expect(result).to.equal("SOME PAYLOAD");
  });

  it("throws an error if an handler is already subcribed", async function () {
    (this.bus as QueryBus).subscribe("TEST", () => {
      return Promise.resolve();
    });

    expect(() => {
      (this.bus as QueryBus).subscribe("TEST", () => {
        return Promise.resolve();
      });
    }).to.throw(`Handler already registered for query type 'TEST'`);
  });

  it("throws an error if there is no handler", function () {
    expect(() => {
      (this.bus as QueryBus).dispatch({
        type: "TEST",
        payload: "SOME PAYLOAD",
      });
    }).to.throw(`No handler for query type 'TEST'`);
  });
});
