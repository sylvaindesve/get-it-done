import { Repository } from "../../../shared/domain/Repository";
import { EventBus } from "../../../shared/domain/event/EventBus";
import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";
import { UserEventStore } from "../../domain/event/UserEventStore";

/**
 * MongoDB specific impletementation of the user repository
 */
export class MongoUserRepository
  extends Repository<User>
  implements UserRepository
{
  /**
   * @param eventStore The user event store
   * @param eventBus The event bus
   */
  constructor(
    protected readonly eventStore: UserEventStore,
    protected readonly eventBus: EventBus
  ) {
    super(eventStore, eventBus, (id: string) => {
      return new User(id);
    });
  }

  /**
   * Check if the provided login exists in the repository
   * @param login The login to check
   * @returns True if the login exists
   */
  hasLogin(login: string): Promise<boolean> {
    return this.eventStore.hasLogin(login);
  }
}
