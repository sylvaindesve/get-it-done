import { AggregateRoot } from "./AggregateRoot";
import { DomainEvent } from "./event/DomainEvent";

/**
 * Event handling function
 */
type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void;

/**
 * A domain entity
 * @template Root Type of the root of the aggregate this entity is from
 */
export class Entity<Root extends AggregateRoot = AggregateRoot> {
  private eventHandlers: { [eventType: string]: EventHandler } = {};

  /**
   * @param aggregateRoot The root of the aggregate this entity is from or null
   *  if this entity happens to be the root
   */
  constructor(public readonly aggregateRoot: Root | null) {
    this.aggregateRoot = aggregateRoot;
  }

  /**
   * Define a handler for a specific event type
   * @param eventType Event type
   * @param handler Handler
   */
  addEventHandler<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ) {
    if (eventType in this.eventHandlers) {
      throw `Handler already defined for event type '${eventType}'`;
    } else {
      this.eventHandlers[eventType] = handler as EventHandler;
    }
  }

  /**
   * Apply a domain event to this entity by delegating it to the aggregate root.
   * `apply` calls `handle` then adds the event to the list of uncommitted
   * events.
   * @param event Event to apply
   */
  apply(event: DomainEvent) {
    if (this.aggregateRoot) this.aggregateRoot.apply(event);
  }

  /**
   * Handle effects of a domain event on this entity
   * @param event Domain event
   */
  handle(event: DomainEvent) {
    if (event.type in this.eventHandlers) {
      this.eventHandlers[event.type].call(this, event);
    }
  }

  /**
   * Recursively handle the event on this entity and all child entities
   * @param event Evénement à gérer
   */
  handleRecursively(event: DomainEvent) {
    this.handle(event);
    for (const entity of this.getChildEntities()) {
      entity.handleRecursively(event);
    }
  }

  /**
   * Method to overload so that it returns all child entities of this entity
   * @returns Child entities of this entity
   */
  getChildEntities(): Entity<Root>[] {
    return [];
  }
}
