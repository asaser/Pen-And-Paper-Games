import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

// Generowanie JWT
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "1h", // Możesz dostosować czas ważności tokenu
  });
};

// Zwracanie zalogowanego użytkownika
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
    };

    const user = await UserModel.findById(decodedToken.userId)
      .select("+email")
      .exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Rejestracja użytkownika
export const signUp: RequestHandler = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameter missing");
    }

    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }

    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) {
      throw createHttpError(409, "Email already taken");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    const token = generateToken(newUser._id.toString());
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    next(error);
  }
};

// Logowanie użytkownika
export const login: RequestHandler = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username })
      .select("+password +email")
      .exec();
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    const token = generateToken(user._id.toString());
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Wylogowanie użytkownika - nie jest wymagane przy JWT, bo nie ma sesji na serwerze
export const logout: RequestHandler = (req, res, next) => {
  res.sendStatus(200); // Po prostu zwracamy 200, użytkownik może usunąć token po stronie klienta
};
