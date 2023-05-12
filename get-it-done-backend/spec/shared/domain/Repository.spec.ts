/* eslint-disable require-jsdoc */
import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import { AggregateRoot } from "../../../src/shared/domain/AggregateRoot";
import { Repository } from "../../../src/shared/domain/Repository";
import { DomainEvent } from "../../../src/shared/domain/event/DomainEvent";
import {
  DomainMessage,
  createDomainMessage,
} from "../../../src/shared/domain/event/DomainMessage";
import { EventStore } from "../../../src/shared/domain/event/EventStore";
import { EventBus } from "../../../src/shared/domain/event/EventBus";

interface TaskDescribed extends DomainEvent {
  type: "TaskDescribed";
  description: string;
}

class Task extends AggregateRoot {
  constructor(
    taskId: string,
    public description = "",
    public completed = false
  ) {
    super(taskId);
    this.addEventHandler("TaskDescribed", (event: TaskDescribed) => {
      this.description = event.description;
    });
    this.addEventHandler("TaskCompleted", () => {
      this.completed = true;
    });
  }
}

describe("Repository", function () {
  beforeEach(function () {
    this.originalDateNow = Date.now;
    Date.now = function () {
      return 42;
    };
  });

  afterEach(function () {
    Date.now = this.originalDateNow;
  });

  it("can load an aggregate root", async function () {
    const fakeEventStore = {
      load: function load(id: string) {
        if (id === "task1") {
          return Promise.resolve([
            createDomainMessage("task1", 0, { type: "TaskCreated" }),
            createDomainMessage("task1", 1, {
              type: "TaskDescribed",
              description: "Something to do",
            }),
            createDomainMessage("task1", 2, { type: "TaskCompleted" }),
          ]);
        } else {
          return Promise.resolve([]);
        }
      },
    };

    const fakeEventBus = {
      publish: function () {
        return Promise.resolve();
      },
    };

    const taskRepository = new Repository<Task>(
      fakeEventStore as unknown as EventStore,
      fakeEventBus as unknown as EventBus,
      (id) => {
        return new Task(id);
      }
    );

    const task = await taskRepository.load("task1");
    expect(task.getAggregateRootId()).to.equal("task1");
    expect(task.description).to.equal("Something to do");
    expect(task.completed).to.equal(true);
  });

  it("can save an aggregate root", async function () {
    const fakeEventStore = {
      savedEvents: [] as DomainMessage[],
      append: function append(_id: string, events: DomainMessage[]) {
        this.savedEvents = events;
      },
    };

    const fakeEventBus = {
      publish: function () {
        return Promise.resolve();
      },
    };

    const taskRepository = new Repository<Task>(
      fakeEventStore as unknown as EventStore,
      fakeEventBus as unknown as EventBus,
      (id) => {
        return new Task(id);
      }
    );

    const task = new Task("task1");
    task.apply({ type: "TaskDescribed", description: "Do this" });
    task.apply({ type: "TaskCompleted" });

    await taskRepository.save(task);

    expect(fakeEventStore.savedEvents).to.deep.equal([
      {
        aggregateId: "task1",
        playhead: 0,
        recordedOn: 42,
        event: { type: "TaskDescribed", description: "Do this" },
      },
      {
        aggregateId: "task1",
        playhead: 1,
        recordedOn: 42,
        event: { type: "TaskCompleted" },
      },
    ]);
  });

  it("publish vents to the event bus", async function () {
    const fakeEventStore = {
      append: function append() {
        return Promise.resolve();
      },
    };

    const fakeEventBus = {
      publishedEvents: [] as DomainMessage[],
      publish: function publish(events: DomainMessage[]) {
        this.publishedEvents.push(...events);
        return Promise.resolve();
      },
    };

    const taskRepository = new Repository<Task>(
      fakeEventStore as unknown as EventStore,
      fakeEventBus as unknown as EventBus,
      (id) => {
        return new Task(id);
      }
    );

    const task = new Task("task1");
    task.apply({ type: "TaskDescribed", description: "Do this" });
    task.apply({ type: "TaskCompleted" });

    await taskRepository.save(task);

    expect(fakeEventBus.publishedEvents).to.deep.equal([
      {
        aggregateId: "task1",
        playhead: 0,
        recordedOn: 42,
        event: { type: "TaskDescribed", description: "Do this" },
      },
      {
        aggregateId: "task1",
        playhead: 1,
        recordedOn: 42,
        event: { type: "TaskCompleted" },
      },
    ]);
  });
});
