import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { signUpUser } from "../../../../../user/application/command/SignUpUser";
import { jwtExpiration, jwtSecret } from "../../config/vars";
import { getUserByLogin } from "../../../../../user/application/query/GetUserByLogin";

import { CommandBus } from "../../../../application/command/CommandBus";
import { QueryBus } from "../../../../application/query/QueryBus";
import { UserReadModel } from "../../../../../user/application/read/UserReadModel";

/**
 * Creates the v1 API router
 * @param commandBus The command bus to use
 * @param queryBus The query bus to use
 * @returns The router
 */
export function v1Router(commandBus: CommandBus, queryBus: QueryBus) {
  const router = Router();

  /**
   * GET /api/v1/status
   */
  router.get("/status", (req, res) => res.send("OK"));

  /**
   * POST /api/v1/users/register
   */
  router.post("/users/register", async (req, res) => {
    const { login, password } = req.body;
    if (!(login && password)) {
      res.status(400).send("Toutes les données sont nécessaires");
      return;
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
      const userId = await commandBus.dispatch(
        signUpUser(login, encryptedPassword)
      );
      const token = jwt.sign({ userId, login }, jwtSecret, {
        expiresIn: jwtExpiration,
      });
      res.status(201).json({ token });
    } catch (error) {
      res.status(409).send(error);
    }
  });

  /**
   * POST /api/v1/users/login
   */
  router.post("/users/login", async (req, res) => {
    const { login, password } = req.body;
    if (!(login && password)) {
      res.status(400).send("Toutes les données sont nécessaires");
      return;
    }

    try {
      const maybeUser = (await queryBus.dispatch(
        getUserByLogin(login)
      )) as UserReadModel;
      if (maybeUser && (await bcrypt.compare(password, maybeUser.password))) {
        const token = jwt.sign({ userId: maybeUser.id, login }, jwtSecret, {
          expiresIn: jwtExpiration,
        });
        res.status(200).json({ token });
      } else {
        res.status(400).send("Données de connexion invalides");
      }
    } catch (error) {
      res.status(409).send(error);
    }
  });

  return router;
}
