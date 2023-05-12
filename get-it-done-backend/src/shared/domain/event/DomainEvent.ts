/**
 * Domain event with type and optional details
 * @template T Details type if any
 */
export interface DomainEvent<T = unknown> {
  /** Event type */
  type: string;
  /** Event details */
  details?: T;
}

/**
 * Create a domain event from type and optional details
 * @param type Event type
 * @param details Optional event details
 * @returns Event created
 */
export function createDomainEvent<T>(
  type: string,
  details?: T
): DomainEvent<T> {
  if (details) {
    return {
      type,
      details,
    };
  } else {
    return { type };
  }
}
