import { gql } from "apollo-server-express";
import userModel from "../../models/user";
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
    currentUser: User
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return await userModel.find().select("_id username email").exec();
    },
    currentUser: async (_: any, __: any, context: any) => {
      if (!context.userId) return null;
      return await userModel
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
      const existingUsername = await userModel.findOne({ username });
      if (existingUsername) throw new Error("Username already taken");
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) throw new Error("Email already taken");
      const passwordHashed = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
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
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) throw new Error("Invalid credentials");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");
      const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return token;
    },
  },
};

export { typeDefs as userTypeDefs, resolvers as userResolvers };
