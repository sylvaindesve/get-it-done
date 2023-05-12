/**
 * A query with type and optional payload
 * @template P The type of the payload if any
 */
export interface Query<P = unknown> {
  /** Query type */
  type: string;
  /** Optional query payload */
  payload?: P;
}
