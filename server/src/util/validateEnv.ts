import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  PORT: port(),
  JWT_SECRET: str(),
});
