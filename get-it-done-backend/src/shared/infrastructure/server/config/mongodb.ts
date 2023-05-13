import { MongoClient } from "mongodb";

import { mongoDb, mongoURI } from "./vars";

const mongoDbClient = new MongoClient(mongoURI);
export const mongoDatabase = mongoDbClient.db(mongoDb);
