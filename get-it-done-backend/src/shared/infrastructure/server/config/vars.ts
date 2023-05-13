import { config } from "dotenv";

config();

export const port = process.env.PORT || "3000";
export const env = process.env.NODE_ENV || "development";
export const jwtSecret = process.env.JWT_SECRET || "secret";
export const jwtExpiration = process.env.JWT_EXPIRATION || "2h";
export const httpLogFormat = env === "production" ? "combined" : "dev";
export const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
export const mongoDb =
  (env === "production" ? process.env.MONGO_DB : process.env.MONGO_DB_DEV) ||
  "get-it-done_dev";
