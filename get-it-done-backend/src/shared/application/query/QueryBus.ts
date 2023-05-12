import { Query } from "./Query";

/**
 * Handler function for a query
 * @template P Payload type of the query
 * @template R Result type of the query execution
 */
type QueryHandler<P = unknown, R = unknown> = (query: Query<P>) => Promise<R>;

/**
 * Bus for executing queries
 */
export class QueryBus {
  /** Query bus registered handlers */
  private handlers: { [queryType: string]: QueryHandler } = {};

  /**
   * Subscribe a handler to a query type
   * @param queryType Query type to subscribe to
   * @param handler Handler responsible for executing the query
   */
  subscribe(queryType: string, handler: QueryHandler): void {
    if (queryType in this.handlers) {
      throw `Handler already registered for query type '${queryType}'`;
    } else {
      this.handlers[queryType] = handler;
    }
  }

  /**
   * Dispatch a query to the bus so it can be executed by the appropriate
   * handler
   * @param query Query to dispatch
   * @returns Result of the query execution
   */
  dispatch(query: Query): Promise<unknown> {
    if (query.type in this.handlers) {
      return this.handlers[query.type](query);
    } else {
      throw `No handler for query type '${query.type}'`;
    }
  }
}
