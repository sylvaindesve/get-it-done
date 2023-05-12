import { ReadModelRepository } from "../../../shared/application/read/ReadModelRepository";
import { UserReadModel } from "./UserReadModel";

/**
 * User specific read model repository
 */
export interface UserReadModelRepository
  extends ReadModelRepository<UserReadModel> {
  /**
   * Get user read model with provided login
   * @param login Login to look for
   * @returns The user read model or `null` if it couldn't be found
   */
  findByLogin(login: string): Promise<UserReadModel | null>;
}
