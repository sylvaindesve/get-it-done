/**
 * A command with type and optional payload
 * @template P The type of the payload if any
 */
export interface Command<P = unknown> {
  /** Command type */
  type: string;
  /** Optional command payload */
  payload?: P;
}
