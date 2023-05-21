import jwt from "jsonwebtoken";

import { jwtSecret } from "../config/vars";
import { NextFunction, Request, Response } from "express";

/**
 * User credentials
 */
export interface UserCredentials {
  /** User ID */
  userId: string;
  /** User login */
  login: string;
}

/**
 * Extended express request to store user credentials
 */
export interface RequestWithCredentials extends Request {
  /** Optional user credentials */
  credentials?: UserCredentials;
}

/**
 * Middleware to check if the request contains a valid JWT token. If it does,
 * the token is decoded and its content are stored in the request so it can be
 * used by future handlers.
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns Response or next
 */
export function authenticate(
  req: RequestWithCredentials,
  res: Response,
  next: NextFunction
) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token nécessaire pour l'authentification");
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.credentials = decoded as UserCredentials;
  } catch (err) {
    return res.status(401).send("Token invalide");
  }
  next();
}
