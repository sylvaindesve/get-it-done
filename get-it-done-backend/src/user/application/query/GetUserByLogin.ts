import { Query } from "../../../shared/application/query/Query";

export const GET_USER_BY_LOGIN = "GET USER BY LOGIN";

interface GetUserByLoginPayload {
  login: string;
}

/**
 * Query to get a user by his/her login
 */
export interface GetUserByLogin extends Query<GetUserByLoginPayload> {
  /** Query type */
  type: typeof GET_USER_BY_LOGIN;
  /** Query payload */
  payload: GetUserByLoginPayload;
}

/**
 * Creates a query to find a user by his/her login
 * @param login The login to search for
 * @returns The query
 */
export function getUserByLogin(login: string): GetUserByLogin {
  return {
    type: GET_USER_BY_LOGIN,
    payload: { login },
  };
}
