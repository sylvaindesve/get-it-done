import { DomainEvent } from "../../../shared/domain/event/DomainEvent";

export const USER_SIGNED_UP = "USER SIGNED UP";

/**
 * User signed up event
 */
export interface UserSignedUp extends DomainEvent {
  /** Event type */
  type: typeof USER_SIGNED_UP;
  /** The login the user signed up with */
  login: string;
  /** The password (encrypted) the user signed up with */
  password: string;
}

/**
 * Creates a user signed up event
 * @param login User login
 * @param password User encrypted password
 * @returns User signed up events
 */
export function userSignedUp(login: string, password: string): UserSignedUp {
  return {
    type: USER_SIGNED_UP,
    login,
    password,
  };
}
