import { gql } from "apollo-server-express";
import userSchema from "../../models/user";
import noteSchema from "../../models/note";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../util/validateEnv";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Note {
    id: ID!
    title: String!
    text: String
    userId: ID!
  }

  type Query {
    users: [User!]!
    notes: [Note!]!
    me: User
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    createNote(title: String!, text: String): Note!
    updateNote(id: ID!, title: String, text: String): Note!
    deleteNote(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return await userSchema.find().select("_id username email").exec();
    },
    notes: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await noteSchema.find({ userId: context.userId }).exec();
    },
    me: async (_: any, __: any, context: any) => {
      if (!context.userId) return null;
      return await userSchema
        .findById(context.userId)
        .select("_id username email")
        .exec();
    },
  },
  Mutation: {
    signUp: async (_: any, { username, email, password }: any) => {
      if (!username || !email || !password) {
        throw new Error("Parameters missing");
      }
      const existingUsername = await userSchema.findOne({ username });
      if (existingUsername) throw new Error("Username already taken");
      const existingEmail = await userSchema.findOne({ email });
      if (existingEmail) throw new Error("Email already taken");
      const passwordHashed = await bcrypt.hash(password, 10);
      const newUser = await userSchema.create({
        username,
        email,
        password: passwordHashed,
      });
      return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      };
    },
    login: async (_: any, { email, password }: any, context: any) => {
      const user = await userSchema.findOne({ email }).select("+password");
      if (!user) throw new Error("Invalid credentials");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");
      const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return token;
    },
    createNote: async (_: any, { title, text }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const note = await noteSchema.create({
        title,
        text,
        userId: context.userId,
      });
      return note;
    },
    updateNote: async (_: any, { id, title, text }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const note = await noteSchema.findOneAndUpdate(
        { _id: id, userId: context.userId },
        { title, text },
        { new: true }
      );
      if (!note) throw new Error("Note not found or not authorized");
      return note;
    },
    deleteNote: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const result = await noteSchema.findOneAndDelete({
        _id: id,
        userId: context.userId,
      });
      return !!result;
    },
  },
};
