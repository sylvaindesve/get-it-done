import { describe, it } from "mocha";

import { ContextConsumer, createContext } from "../../../src/lib/context";
import { BaseView } from "../../../src/view/base-view";
import { expect } from "chai";

const testContext = createContext<string>(Symbol("test"));

describe("ContextConsumer", function () {
  it("consumes a context", function () {
    class TestConsumer extends BaseView {
      public consumer: ContextConsumer<typeof testContext>;

      constructor() {
        super();
        this.consumer = new ContextConsumer(this, { context: testContext });
      }
    }
    window.customElements.define("context-consumer", TestConsumer);

    document.body.addEventListener("context-request", (ev) => {
      if (ev.context === testContext) {
        ev.stopPropagation();
        ev.callback("test context value");
      }
    });

    document.body.innerHTML = `<context-consumer></context-consumer>`;
    const testConsumer = document.querySelector(
      "context-consumer"
    ) as TestConsumer;
    expect(testConsumer.consumer.value).to.equal("test context value");
  });
});
