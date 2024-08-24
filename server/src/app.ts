import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import createHttpError, { isHttpError } from "http-errors";
// import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app: Express = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app
//   .use (
//   session({
//     secret: env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 60 * 60 * 1000,
//     },
//     rolling: true,
//     store: MongoStore.create({
//       mongoUrl: env.MONGODB_URI,
//     }),
//   })
//   );

app.use("/api/users", userRoutes);

// TODO - check it
// app.use("/api/notes", notesRoutes);
// app.use("/api/notes", requiresAuth, notesRoutes);

// app.use((req, res, next) => {
//   next(createHttpError(404, "Parameters missing"));
// });

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
