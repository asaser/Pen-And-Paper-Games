import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import NoteModel from "./models/note";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (_req: Request, res: Response) => {
  // res.status(200).send("Server is running");
  const notes = await NoteModel.find().exec();
});

export default app;
