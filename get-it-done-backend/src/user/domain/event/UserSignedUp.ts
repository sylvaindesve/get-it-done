import { DomainEvent } from "../../../shared/domain/event/DomainEvent";

/**
 * User signed up event
 */
export interface UserSignedUp extends DomainEvent {
  /** Event type */
  type: "USER SIGNED UP";
  /** The login the user signed up with */
  login: string;
  /** The password (encrypted) the user signed up with */
  password: string;
}
