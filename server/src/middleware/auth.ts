import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

export const requiresAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
    };

    req.userId = decodedToken.userId; // Dodaj userId do obiektu req
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid token or token missing"));
  }
};
