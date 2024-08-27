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
    const user = await UserModel.findById(req.userId).select("+email").exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SighUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SighUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }

    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) {
      throw createHttpError(409, "Email already taken");
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    const token = jwt.sign({ userId: newUser._id }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;

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

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Wylogowanie użytkownika - nie jest wymagane przy JWT, bo nie ma sesji na serwerze
export const logout: RequestHandler = (req, res, next) => {
  // Logout is typically handled on the client side by removing the JWT from storage
  res.sendStatus(200);
};
