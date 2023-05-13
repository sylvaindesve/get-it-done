import { CommandBus } from "../../application/command/CommandBus";
import { QueryBus } from "../../application/query/QueryBus";
import { EventBus } from "../../domain/event/EventBus";

import { connectUserDomain } from "../../../user/application/connectUserDomain";
import { MongoUserEventStore } from "../../../user/infrastructure/domain/event/MongoUserEventStore";
import { MongoUserRepository } from "../../../user/infrastructure/domain/MongoUserRepository";
import { MongoUserReadModelRepository } from "../../../user/infrastructure/application/read/MongoUserReadModelRepository";

import { v1Router } from "./api/routes/v1";
import { app } from "./config/express";
import { logger } from "./config/logger";
import { mongoDatabase } from "./config/mongodb";
import { port, env } from "./config/vars";
import { DomainMessage } from "../../domain/event/DomainMessage";
import { DomainEvent } from "../../domain/event/DomainEvent";

const eventBus = new EventBus();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

const userEventsCollection =
  mongoDatabase.collection<DomainMessage<DomainEvent>>("user_events");

const userEventStore = new MongoUserEventStore(userEventsCollection);
connectUserDomain({
  eventBus,
  commandBus,
  queryBus,
  userRepository: new MongoUserRepository(userEventStore, eventBus),
  userReadModelRepository: new MongoUserReadModelRepository(
    mongoDatabase.collection("user_models")
  ),
});

app.use("/api/v1", v1Router(commandBus, queryBus));

app.listen(port, () =>
  logger.info(`Serveur démarré sur le port ${port} (${env})`)
);
