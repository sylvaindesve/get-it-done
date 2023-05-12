import { Repository } from "../../shared/domain/Repository";
import { User } from "./User";

/**
 * Specific interface of the user repository.
 */
export interface UserRepository extends Repository<User> {
  /**
   * Check if the provided login exists in the repository
   * @param login The login to check
   * @returns True if the login exists
   */
  hasLogin(login: string): Promise<boolean>;
}
