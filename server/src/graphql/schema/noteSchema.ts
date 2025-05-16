import { gql } from "apollo-server-express";
import noteModel from "../../models/note";

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
    createNote(title: String!, text: String): Note!
    updateNote(id: ID!, title: String, text: String): Note!
    deleteNote(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    notes: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await noteModel.find({ userId: context.userId }).exec();
    },
  },
  Mutation: {
    createNote: async (_: any, { title, text }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const note = await noteModel.create({
        title,
        text,
        userId: context.userId,
      });
      return note;
    },
    updateNote: async (_: any, { id, title, text }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const note = await noteModel.findOneAndUpdate(
        { _id: id, userId: context.userId },
        { title, text },
        { new: true }
      );
      if (!note) throw new Error("Note not found or not authorized");
      return note;
    },
    deleteNote: async (_: any, { id }: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const result = await noteModel.findOneAndDelete({
        _id: id,
        userId: context.userId,
      });
      return !!result;
    },
  },
};

export { typeDefs as noteTypeDefs, resolvers as noteResolvers };
