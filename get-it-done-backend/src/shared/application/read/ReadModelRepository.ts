import { ReadModel } from "./ReadModel";

/**
 * Interface for a read moodel repository
 */
export interface ReadModelRepository<T extends ReadModel = ReadModel> {
  /**
   * Try to find the read model with the provided ID or returns null if it can't
   * find it
   * @param id ID of the searched read model
   * @returns The found read model or `null`
   */
  find(id: string): Promise<T | null>;

  /**
   * Save the provided read model
   * @param model The read model to save
   */
  save(model: T): Promise<void>;
}
