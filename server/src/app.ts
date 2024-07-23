import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import notesRoutes from "./routes/notes";
import createHttpError, { isHttpError } from "http-errors";

const app: Express = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/notes", notesRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "Unknow error occured";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
