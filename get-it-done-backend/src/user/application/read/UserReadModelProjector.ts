import { ReadModelRepository } from "../../../shared/application/read/ReadModelRepository";
import { DomainMessage } from "../../../shared/domain/event/DomainMessage";
import { EventBus } from "../../../shared/domain/event/EventBus";
import { USER_SIGNED_UP, UserSignedUp } from "../../domain/event/UserSignedUp";
import { UserReadModel } from "./UserReadModel";

/**
 * Projector to update user read models
 */
export class UserReadModelProjector {
  /**
   * @param userReadModelRepository The user read model repository
   */
  constructor(
    protected userReadModelRepository: ReadModelRepository<UserReadModel>
  ) {}

  /**
   * Handles user signed up event
   * @param message Event message
   */
  async handleUserSignedUp(message: DomainMessage) {
    const userId = message.aggregateId;
    const { login, password } = message.event as UserSignedUp;
    await this.userReadModelRepository.save({ id: userId, login, password });
  }

  /**
   * Listen to the provided event bus
   * @param eventBus The event bus to listen to
   */
  listenTo(eventBus: EventBus) {
    eventBus.subscribe(USER_SIGNED_UP, this.handleUserSignedUp.bind(this));
  }
}
