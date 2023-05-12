import { DomainEvent } from "./DomainEvent";

/**
 * A message encapsulating a domain event with additional context data
 * @template T Domain event type
 */
export interface DomainMessage<T extends DomainEvent = DomainEvent> {
  /** ID of the aggregate issuing this domain event */
  aggregateId: string;
  /** Order of this event for this aggregate */
  playhead: number;
  /** Time when the event was recorded on */
  recordedOn: number;
  /** The actuel event */
  event: T;
}

/**
 * Create a message from an event, aggregate ID and playhead and sets it as
 * recorded now
 * @param aggregateId ID of the aggregate issuing the domain event
 * @param playhead Order of this event for this aggregate
 * @param event The event
 * @returns A message encapsulating the event
 */
export function createDomainMessage<T extends DomainEvent>(
  aggregateId: string,
  playhead: number,
  event: T
): DomainMessage<T> {
  return {
    aggregateId,
    playhead,
    event,
    recordedOn: Date.now(),
  };
}
