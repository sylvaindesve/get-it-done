import { AggregateRoot } from "../../shared/domain/AggregateRoot";

import { userSignedUp } from "./event/UserSignedUp";

/**
 * A user in the system
 */
export class User extends AggregateRoot {
  /**
   * Sign a user up : creates the User instance and apply the user signed up
   * event to it
   * @param userId User ID
   * @param login User login
   * @param password User encrypted password
   * @returns Usr instance
   */
  static signUp(userId: string, login: string, password: string) {
    const instance = new User(userId);
    instance.apply(userSignedUp(login, password));
    return instance;
  }

  /**
   * @param userId User ID
   */
  constructor(userId: string) {
    super(userId);
  }
}
