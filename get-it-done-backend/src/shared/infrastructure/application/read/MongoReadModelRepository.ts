import { Collection, Filter } from "mongodb";
import { ReadModel } from "../../../application/read/ReadModel";
import { ReadModelRepository } from "../../../application/read/ReadModelRepository";

/**
 * MongoDB implementation of a read model repository
 */
export class MongoReadModelRepository<T extends ReadModel = ReadModel>
  implements ReadModelRepository<T>
{
  /**
   * @param mongoCollection The collection where read models are stored
   */
  constructor(protected mongoCollection: Collection<T>) {}

  /**
   * Try to find the read model with the provided ID or returns null if it can't
   * find it
   * @param id ID of the searched read model
   * @returns The found read model or `null`
   */
  async find(id: string) {
    return await this.mongoCollection.findOne<T>({ id } as Filter<T>, {
      projection: { _id: 0 },
    });
  }

  /**
   * Save the provided read model
   * @param model The read model to save
   */
  async save(model: T) {
    await this.mongoCollection.replaceOne(
      { id: model.id } as Filter<T>,
      model,
      {
        upsert: true,
      }
    );
  }
}
