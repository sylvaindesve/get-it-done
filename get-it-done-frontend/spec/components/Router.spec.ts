import chai, { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { Router } from "../../src/components/Router";

describe("Router", function () {
  beforeEach(function () {
    window.history.pushState(null, "", "/");
  });

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

  it("cannot register a route more than once", function () {
    const router = new Router();
    router.addRouteListener("/home", () => {
      return;
    });
    expect(() => {
      router.addRouteListener("/home", () => {
        return;
      });
    }).to.throw(`Path '/home' already registered`);
  });

  it("immediately navigate to path uppon route registration if the current path matches", function () {
    const router = new Router();
    const listener = fake();
    router.addRouteListener("/", listener);
    expect(listener).to.have.been.called;
  });

  it("reacts to 'popstate' event by calling the appropriate route listener", function () {
    const router = new Router();
    document.body.appendChild(router);
    const listener = fake();
    router.addRouteListener("/", listener);
    window.dispatchEvent(new Event("popstate"));
    expect(listener).to.have.been.calledTwice;
  });
});
