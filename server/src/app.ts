import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/schema";
import jwt from "jsonwebtoken";
import env from "./util/validateEnv";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.split(" ")[1];
      let userId = null;
      if (token) {
        try {
          const payload = jwt.verify(token, env.JWT_SECRET) as {
            userId: string;
          };
          userId = payload.userId;
        } catch (e) {
          throw new Error("Invalid token");
        }
      }
      return { req, userId };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any, path: "/graphql" });
}

export default app;
