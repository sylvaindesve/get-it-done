import { MongoReadModelRepository } from "../../../../shared/infrastructure/application/read/MongoReadModelRepository";

import { UserReadModel } from "../../../application/read/UserReadModel";
import { UserReadModelRepository } from "../../../application/read/UserReadModelRepository";

/**
 * MongoDB specific implementation of the user read model repository
 */
export class MongoUserReadModelRepository
  extends MongoReadModelRepository<UserReadModel>
  implements UserReadModelRepository
{
  /**
   * Get user read model with provided login
   * @param login Login to look for
   * @returns The user read model or `null` if it couldn't be found
   */
  async findByLogin(login: string) {
    return await this.mongoCollection.findOne<UserReadModel>(
      { login },
      { projection: { _id: 0 } }
    );
  }
}
