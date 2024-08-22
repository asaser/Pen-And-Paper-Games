import "dotenv/config";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

export const createSecretToken = (id: string): string => {
  if (!env.TOKEN_KEY) {
    throw new Error("TOKEN_KEY is not defined in the environment variables");
  }

  return jwt.sign({ id }, env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
