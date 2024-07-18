import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

export default app;
