import { CommandBus } from "../../shared/application/command/CommandBus";
import { QueryBus } from "../../shared/application/query/QueryBus";
import { EventBus } from "../../shared/domain/event/EventBus";
import { UserRepository } from "../domain/UserRepository";
import { UserCommandHandler } from "./command/UserCommandHandler";
import { UserQueryHandler } from "./query/UserQueryHandler";
import { UserReadModelProjector } from "./read/UserReadModelProjector";
import { UserReadModelRepository } from "./read/UserReadModelRepository";

interface UserConnectParams {
  eventBus: EventBus;
  commandBus: CommandBus;
  queryBus: QueryBus;
  userRepository: UserRepository;
  userReadModelRepository: UserReadModelRepository;
}

/**
 * Connect the user domain
 * @param params Connection parameters
 */
export default function connect(params: UserConnectParams) {
  const {
    eventBus,
    commandBus,
    queryBus,
    userRepository,
    userReadModelRepository,
  } = params;

  const commandHandler = new UserCommandHandler(userRepository);
  commandHandler.listenTo(commandBus);

  const userProjector = new UserReadModelProjector(userReadModelRepository);
  userProjector.listenTo(eventBus);

  const queryHandler = new UserQueryHandler(userReadModelRepository);
  queryHandler.listenTo(queryBus);
}
