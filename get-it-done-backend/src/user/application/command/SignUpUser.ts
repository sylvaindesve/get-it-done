import { Command } from "../../../shared/application/command/Command";

export const SIGN_UP_USER = "SIGN UP USER";

interface SignUpUserPayload {
  login: string;
  password: string;
}

/**
 * Command for user sign up
 */
export interface SignUpUser extends Command<SignUpUserPayload> {
  /** Command type */
  type: typeof SIGN_UP_USER;
  /** Command payload */
  payload: SignUpUserPayload;
}

/**
 * Creates a command for user sign up
 * @param login User login
 * @param password User password
 * @returns User sign up commande
 */
export function signUpUser(login: string, password: string): SignUpUser {
  return {
    type: SIGN_UP_USER,
    payload: { login, password },
  };
}
