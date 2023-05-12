import { DomainEvent } from "./DomainEvent";
import { DomainMessage } from "./DomainMessage";

/** Event listener function */
type EventListener<T extends DomainEvent = DomainEvent> = (
  message: DomainMessage<T>
) => void;

/**
 * An event bus
 */
export class EventBus {
  private listeners: { [eventType: string]: EventListener[] } = {};

  /**
   * Subscribe a handler to a specific event type
   * @param eventType Event type to listen to
   * @param listener Event handler
   */
  subscribe(eventType: string, listener: EventListener): void {
    if (eventType in this.listeners) {
      this.listeners[eventType].push(listener);
    } else {
      this.listeners[eventType] = [listener];
    }
  }

  /**
   * Asynchronously publish event message to the bus so handlers can react to it
   * @param messages Event messages to publish
   */
  publish(messages: DomainMessage[]): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        for (const message of messages) {
          if (message.event.type in this.listeners) {
            for (const listener of this.listeners[message.event.type]) {
              listener(message);
            }
          }
        }
        resolve();
      });
    });
  }
}
