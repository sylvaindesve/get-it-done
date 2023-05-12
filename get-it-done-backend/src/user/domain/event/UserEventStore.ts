import { EventStore } from "../../../shared/domain/event/EventStore";

/**
 * Specific interface of the event store for user events.
 */
export interface UserEventStore extends EventStore {
  /**
   * Check if the provided login exists in the event store
   * @param login The login to check
   * @returns True if the login exists
   */
  hasLogin(login: string): Promise<boolean>;
}
