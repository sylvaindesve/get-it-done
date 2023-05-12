import { AggregateRoot } from "./AggregateRoot";
import { EventBus } from "./event/EventBus";
import { EventStore } from "./event/EventStore";

type AggregateFactory<T extends AggregateRoot = AggregateRoot> = (
  id: string
) => T;

/**
 * An aggregate root repository with storage delegated to an event store and
 * responsible of publishing events to the event bus
 * @template T Type of the managed aggregate roots
 */
export class Repository<T extends AggregateRoot = AggregateRoot> {
  /**
   * @param eventStore Le dépôt d'événements
   *  à utiliser
   * @param eventBus Le bus d'événements sur lequel publier
   * @param aggregateFactory La fonction permettant de
   *  créer une instance de l'agrégat
   */
  constructor(
    protected readonly eventStore: EventStore,
    protected readonly eventBus: EventBus,
    protected aggregateFactory: AggregateFactory<T>
  ) {}

  /**
   * Load an aggregate root by loading all related events
   * @param id Aggregate root ID
   * @returns The aggregate root
   */
  async load(id: string) {
    const events = await this.eventStore.load(id);
    const aggregate = this.aggregateFactory(id);
    aggregate.initializeState(events);
    return aggregate;
  }

  /**
   * Save an aggregate root by appending its uncommitted events to the
   * underlying event store
   * @param aggregate The aggregate
   */
  async save(aggregate: T) {
    const events = aggregate.getUncommittedEvents();
    await this.eventStore.append(aggregate.getAggregateRootId(), events);
    this.eventBus.publish(events);
  }
}
