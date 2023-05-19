import chai, { expect } from "chai";
import { describe, it } from "mocha";
import { fake } from "sinon";
import sinonChai from "sinon-chai";

import { ValueNotifier } from "../../../src/lib/context";

chai.use(sinonChai);

describe("ValueNotifier", function () {
  it("can be instanciated with a default value", function () {
    const vn = new ValueNotifier("default");
    expect(vn.value).to.equal("default");
  });

  it("can register a 'once' callback", function () {
    const cb = fake();
    const vn = new ValueNotifier("initial value");
    vn.addCallback(cb);
    vn.setValue("new value");
    expect(cb).to.have.been.calledOnceWith("initial value");
  });

  it("can register a callback to be notified each time the value change", function () {
    const cb = fake();
    const vn = new ValueNotifier("initial value");

    vn.addCallback(cb, true);
    expect(cb).to.have.been.calledOnceWith("initial value");
    cb.resetHistory();

    vn.setValue("second value");
    expect(cb).to.have.been.calledOnceWith("second value");
    cb.resetHistory();

    vn.setValue("third value");
    expect(cb).to.have.been.calledOnceWith("third value");
  });

  it("registers a callback only once", function () {
    const cb = fake();
    const vn = new ValueNotifier("initial value");

    vn.addCallback(cb, true);
    vn.addCallback(cb, true);
    cb.resetHistory();

    vn.setValue("second value");
    expect(cb).to.have.been.calledOnce;
  });

  it("calls the callback with an `unsubscribe` function", function () {
    const cb = fake();
    const vn = new ValueNotifier("initial value");
    vn.addCallback(cb, true);
    cb.resetHistory();

    vn.setValue("second value");
    expect(cb).to.have.been.calledOnceWith("second value");
    const unsubscribe = cb.firstCall.args[1];
    unsubscribe();

    cb.resetHistory();
    vn.setValue("third value");
    expect(cb).to.not.have.been.called;
  });

  it("can clear all callbacks", function () {
    const cb1 = fake();
    const cb2 = fake();
    const vn = new ValueNotifier("initial value");

    vn.addCallback(cb1, true);
    vn.addCallback(cb2, true);
    cb1.resetHistory();
    cb2.resetHistory();

    vn.clearCallbacks();
    vn.setValue("new value");

    expect(cb1).to.not.have.been.called;
    expect(cb2).to.not.have.been.called;
  });
});
