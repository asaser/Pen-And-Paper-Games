import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  PORT: port(),
  TOKEN_KEY: str(),
  // SESSION_SECRET: str(),
});
