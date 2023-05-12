import { Collection } from "mongodb";

import { DomainMessage } from "../../../domain/event/DomainMessage";
import { EventStore } from "../../../domain/event/EventStore";

/**
 * MongoDB implementation of an event store
 */
export class MongoEventStore implements EventStore {
  /**
   *
   * @param mongoCollection The collection where events are stored
   */
  constructor(protected mongoCollection: Collection<DomainMessage>) {}

  /**
   * Load all event messages related to the aggregate root with provided ID
   * @param id Aggregate root ID
   * @returns The event messages
   */
  async load(id: string) {
    const cursor = this.mongoCollection.find(
      { id },
      { projection: { _id: 0 } }
    );
    const events = await cursor.toArray();
    return events;
  }

  /**
   * Append event messages for an aggregate root to the store
   * @param id Aggregate root ID
   * @param events Event messages to append to the store
   */
  async append(id: string, events: DomainMessage[]) {
    await this.mongoCollection.insertMany(events, { ordered: true });
  }
}
