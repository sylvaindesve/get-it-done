import { DomainEvent } from "./event/DomainEvent";
import { DomainMessage, createDomainMessage } from "./event/DomainMessage";

import { Entity } from "./Entity";

/**
 * A domain entity which happens to be the root of an aggregate
 */
export class AggregateRoot extends Entity {
  private aggregateId: string;
  private playhead = -1;

  private uncommittedEvents: DomainMessage[] = [];

  /**
   * @param aggregateId Aggregate root ID
   */
  constructor(aggregateId: string) {
    super(null);
    this.aggregateId = aggregateId;
  }

  /**
   * @returns The aggregate root ID
   */
  getAggregateRootId(): string {
    return this.aggregateId;
  }

  /**
   * Returns uncommitted events (encapsulated in messages) and forget them
   * @returns Uncommitted events
   */
  getUncommittedEvents(): DomainMessage[] {
    const events = this.uncommittedEvents;
    this.uncommittedEvents = [];
    return events;
  }

  /**
   * Initialize this aggregate root with provided events
   * @param messages Events to apply
   */
  initializeState(messages: DomainMessage[]): void {
    for (const message of messages) {
      this.playhead += 1;
      this.handleRecursively(message.event);
    }
  }

  /**
   * Apply a domain event to the aggregate. `apply` calls `handle` then adds the
   * event to the list of uncommitted events.
   * @param event Event to apply
   */
  apply<T extends DomainEvent>(event: T) {
    this.handleRecursively(event);
    this.playhead += 1;
    this.uncommittedEvents.push(
      createDomainMessage(this.aggregateId, this.playhead, event)
    );
  }
}
