/**
 * Backend interface
 */
export class Backend {
  /**
   * @param _fetch The `fetch`to use
   */
  constructor(private _fetch: typeof fetch) {}

  /**
   * Send a register request to the backend server
   * @param login user login
   * @param password user password
   * @returns the connection token
   */
  async signup(login: string, password: string) {
    const serverResponse = await this._fetch("/api/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    if (!serverResponse.ok) {
      throw new Error(
        `Sign up failed: ${serverResponse.status} ${serverResponse.statusText}`
      );
    }

    return (await serverResponse.json()) as { token: string };
  }
}
