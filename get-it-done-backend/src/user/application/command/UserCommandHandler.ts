import { v4 as uuid } from "uuid";

import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";
import { CommandBus } from "../../../shared/application/command/CommandBus";
import { SIGN_UP_USER, SignUpUser } from "./SignUpUser";
import { Command } from "../../../shared/application/command/Command";

/**
 * Hander for user commands
 */
export class UserCommandHandler {
  /**
   * @param userRepository Le dépôt des agrégats utilisateur
   */
  constructor(protected userRepository: UserRepository) {}

  /**
   * Handle a sign up user command
   * @param command Sign up user commande
   * @returns The user unique ID
   */
  async handleSignUpUser(command: Command) {
    const { login, password } = (command as SignUpUser).payload;

    if (await this.userRepository.hasLogin(login)) {
      throw "Login already exists";
    }

    const userId = uuid();
    const user = User.signUp(userId, login, password);
    await this.userRepository.save(user);
    return userId;
  }

  /**
   * Listen to the provided command bus
   * @param commandBus Command bus to listen to
   */
  listenTo(commandBus: CommandBus) {
    commandBus.subscribe(SIGN_UP_USER, this.handleSignUpUser.bind(this));
  }
}
