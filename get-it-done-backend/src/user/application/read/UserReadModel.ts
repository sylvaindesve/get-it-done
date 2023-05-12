import { ReadModel } from "../../../shared/application/read/ReadModel";

/**
 * User read model
 */
export interface UserReadModel extends ReadModel {
  /** User login */
  login: string;
  /** User encrypted password */
  password: string;
}
