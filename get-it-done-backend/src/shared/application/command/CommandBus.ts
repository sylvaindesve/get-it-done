import { Command } from "./Command";

/**
 * Handler function for a command
 * @template P Payload type of the command
 * @template R Result type of the command execution
 */
type CommandHandler<P = unknown, R = unknown> = (
  command: Command<P>
) => Promise<R>;

/**
 * Bus to execute commands.
 */
export class CommandBus {
  private handlers: { [commandType: string]: CommandHandler } = {};

  /**
   * Subscribe a handler to a command type
   * @param commandType Command type to subscribe to
   * @param handler Handler responsible for executing the command
   */
  subscribe(commandType: string, handler: CommandHandler): void {
    if (commandType in this.handlers) {
      throw `Handler already registered for command type '${commandType}'`;
    } else {
      this.handlers[commandType] = handler;
    }
  }

  /**
   * Dispatch a command to the bus so it can be executed by the appropriate
   * handler
   * @param command Command to execute
   * @returns Result of the command execution
   */
  dispatch(command: Command): Promise<unknown> {
    if (command.type in this.handlers) {
      return this.handlers[command.type](command);
    } else {
      throw `No handler for command type '${command.type}'`;
    }
  }
}
