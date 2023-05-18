import { expect } from "chai";
import { describe, it } from "mocha";

import {
  ContextProvider,
  ContextRequestEvent,
  createContext,
} from "../../../src/lib/context";
import { BaseView } from "../../../src/view/base-view";

const testContext = createContext<string>(Symbol("test"));

describe("ContextProvider", function () {
  it("provides a context", function () {
    class TestProvider extends BaseView {
      constructor() {
        super();
        new ContextProvider(this, {
          context: testContext,
          initialValue: "initial value",
        });
      }
    }
    window.customElements.define("test-provider", TestProvider);

    class TestConsumer extends HTMLElement {
      public provided?: string;

      connectedCallback() {
        this.dispatchEvent(
          new ContextRequestEvent(testContext, (value) => {
            this.provided = value;
          })
        );
      }
    }
    window.customElements.define("test-consumer", TestConsumer);

    document.body.innerHTML = `<test-provider>
      <test-consumer></test-consumer>
    </test-provider>`;

    const consumer = document.querySelector("test-consumer") as TestConsumer;
    expect(consumer.provided).to.equal("initial value");
  });
});
