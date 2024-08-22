import { RequestHandler } from "express";
import createHttpError from "http-errors";

// TODO - change later (req.session.userId)
export const requiresAuth: RequestHandler = (req, res, next) => {
  next();

  // if (req.session.userId) {
  //   next();
  // } else {
  //   next(createHttpError(401, "User not authenticated"));
  // }
};
