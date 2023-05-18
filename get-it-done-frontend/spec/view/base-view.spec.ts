import { expect } from "chai";
import { describe } from "mocha";

import { BaseView } from "../../src/view/base-view";

describe("BaseView", function () {
  it("renders", function () {
    class TestView extends BaseView {
      static get template() {
        return `some content`;
      }

      static get style() {
        return `:host{display:block;}`;
      }
    }
    window.customElements.define("test-view", TestView);

    document.body.innerHTML = "<test-view></test-view>";
    const testView = document.querySelector("test-view") as TestView;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(testView.shadowRoot!.innerHTML).to.equal(
      `<style>:host{display:block;}</style>some content`
    );
  });
});
