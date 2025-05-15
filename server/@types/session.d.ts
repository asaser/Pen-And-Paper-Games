import mongoose from "mongoose";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

// import mongoose from "mongoose";

// declare module "express-session" {
//   interface SessionData {
//     userId: mongoose.Types.ObjectId;
//   }
// }
