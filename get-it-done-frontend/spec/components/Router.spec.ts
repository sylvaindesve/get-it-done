import chai, { expect } from "chai";
import { describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { Router } from "../../src/components/Router";

describe("Router", function () {
  it("can register route listeners", function () {
    const router = new Router();
    expect("addRouteListener" in router).to.be.true;
  });

  it("calls the appropriate route listener when a route is clicked", function () {
    document.body.innerHTML = `<gid-router>
      <a route="/someroute"></a>
    </gid-router>`;

    const router = document.querySelector("gid-router") as Router;
    const link = document.querySelector("a") as HTMLAnchorElement;

    const listener = fake();
    router.addRouteListener("/someroute", listener);

    link.click();

    expect(listener).to.have.been.called;
    expect(listener.firstCall.firstArg).to.deep.equal({ path: "/someroute" });
  });
});
