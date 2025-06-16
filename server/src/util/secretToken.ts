import "dotenv/config";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

export const createSecretToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
