import mongoose from "mongoose";
import { Request } from "express";

// Rozszerzenie obiektu Request
declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // Lub mongoose.Types.ObjectId jeśli wolisz
  }
}

// import mongoose from "mongoose";

// declare module "express-session" {
//   interface SessionData {
//     userId: mongoose.Types.ObjectId;
//   }
// }
