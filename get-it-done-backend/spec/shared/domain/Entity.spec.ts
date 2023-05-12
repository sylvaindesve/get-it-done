/* eslint-disable require-jsdoc */
import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import { DomainEvent } from "../../../src/shared/domain/event/DomainEvent";
import { Entity } from "../../../src/shared/domain/Entity";
import { AggregateRoot } from "../../../src/shared/domain/AggregateRoot";

describe("Entity", function () {
  beforeEach(function () {
    this.originalDateNow = Date.now;
    Date.now = function () {
      return 42;
    };
  });

  afterEach(function () {
    Date.now = this.originalDateNow;
  });
  it("can handle events", function () {
    interface UserRenamed extends DomainEvent {
      type: "UserRenamed";
      username: string;
    }

    class User extends Entity {
      constructor(public username: string = "") {
        super(null);
        this.addEventHandler("UserRenamed", (event: UserRenamed) => {
          this.username = event.username;
        });
      }
    }

    const user = new User();
    const userRenamed: UserRenamed = {
      type: "UserRenamed",
      username: "John Doo",
    };
    user.handle(userRenamed);
    expect(user.username).to.equal("John Doo");
  });

  it("can only have one handler for each event type", function () {
    class Task extends Entity {}
    const task = new Task(null);
    task.addEventHandler("TaskCompleted", () => {
      return;
    });
    expect(() => {
      task.addEventHandler("TaskCompleted", () => {
        return;
      });
    }).to.throw(`Handler already defined for event type 'TaskCompleted'`);
  });

  it("can apply events by delegating to the aggregate root", function () {
    class Task extends Entity {}

    const fakeRoot = {
      eventsApplied: [] as DomainEvent[],
      apply: function (event: DomainEvent) {
        this.eventsApplied.push(event);
      },
    };

    const task = new Task(fakeRoot as unknown as AggregateRoot);
    task.apply({ type: "TaskCompleted" });
    expect(fakeRoot.eventsApplied).to.deep.equal([{ type: "TaskCompleted" }]);
  });

  it("can recursively handle events", function () {
    class Item extends Entity {
      constructor(root: AggregateRoot | null, public completed = false) {
        super(root);
        this.addEventHandler("AllItemCompleted", () => (this.completed = true));
      }
    }

    class List extends Entity {
      public items: Item[] = [];
      constructor() {
        super(null);
      }

      getChildEntities() {
        return this.items;
      }
    }

    const list = new List();
    const [item1, item2, item3] = [
      new Item(null),
      new Item(null),
      new Item(null),
    ];
    list.items.push(item1, item2, item3);

    const allItemCompleted = { type: "AllItemCompleted" };
    list.handleRecursively(allItemCompleted);
    expect(item1.completed).to.be.true;
    expect(item2.completed).to.be.true;
    expect(item3.completed).to.be.true;
  });
});
