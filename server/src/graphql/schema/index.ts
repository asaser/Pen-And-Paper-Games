import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { userTypeDefs, userResolvers } from "./userSchema";
import { noteTypeDefs, noteResolvers } from "./noteSchema";

export const typeDefs = mergeTypeDefs([userTypeDefs, noteTypeDefs]);
export const resolvers = mergeResolvers([userResolvers, noteResolvers]);
