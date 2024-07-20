import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

import NoteModel from "./models/note";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (_req, res, next) => {
  try {
    throw Error("kkkkkkk");

    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(Error("Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Test - something wrong LOL";

  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
});

export default app;
