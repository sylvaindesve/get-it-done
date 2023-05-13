import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { httpLogFormat } from "./vars";

export const app = express();
app.use(morgan(httpLogFormat));
app.use(bodyParser.json());
