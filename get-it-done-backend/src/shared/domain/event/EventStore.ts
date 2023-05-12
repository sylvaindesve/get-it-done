import { DomainMessage } from "./DomainMessage";

/**
 * Interface for an event store
 */
export interface EventStore {
  /**
   * Load all event messages related to the aggregate root with provided ID
   * @param id Aggregate root ID
   */
  load(id: string): Promise<DomainMessage[]>;

  /**
   * Append event messages for an aggregate root to the store
   * @param id Aggregate root ID
   * @param events Event messages to append to the store
   */
  append(id: string, events: DomainMessage[]): Promise<void>;
}
