import express, { Express, Request, Response } from "express";
import env from "./util/validateEnv";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Install additional library `npm i envalid` and `eslint` but not latest version, only 8.30 version or something similar

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = env.MONGODB_URI || "mongodb://localhost:27017";
const port = env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.listen(port!, () => {
  console.log(`Server is running on PORT: ${port}`);
});
