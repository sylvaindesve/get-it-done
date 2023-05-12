import { Query } from "../../../shared/application/query/Query";
import { UserReadModelRepository } from "../read/UserReadModelRepository";
import { GET_USER_BY_LOGIN, GetUserByLogin } from "./GetUserByLogin";
import { QueryBus } from "../../../shared/application/query/QueryBus";

/**
 * Handler for user queries
 */
export class UserQueryHandler {
  /**
   * @param userReadModelRepository User read model repository
   */
  constructor(protected userReadModelRepository: UserReadModelRepository) {}

  /**
   * Handle the get user by login query
   * @param query Get user by login query
   * @returns The found user read model or `null` if it cannot be found
   */
  handleGetUser(query: Query) {
    const login = (query as GetUserByLogin).payload.login;
    return this.userReadModelRepository.findByLogin(login);
  }

  /**
   * Listen to queries on the provided bus
   * @param queryBus The query bus to listen to
   */
  listenTo(queryBus: QueryBus) {
    queryBus.subscribe(GET_USER_BY_LOGIN, this.handleGetUser.bind(this));
  }
}
