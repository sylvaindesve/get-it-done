import { MongoEventStore } from "../../../shared/infrastructure/domain/event/MongoEventStore";
import { UserEventStore } from "../../domain/event/UserEventStore";

/**
 * MongoDB specific implementation of the user event store
 */
export class MongoUserEventStore
  extends MongoEventStore
  implements UserEventStore
{
  /**
   * Check if the provided login exists in the event store
   * @param login The login to check
   * @returns True if the login exists
   */
  async hasLogin(login: string): Promise<boolean> {
    return (
      (await this.mongoCollection.findOne({
        "event.type": "USER SIGNED UP",
        "event.login": login,
      })) !== null
    );
  }
}
