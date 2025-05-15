import app, { startApolloServer } from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const uri = env.MONGODB_URI || "mongodb://localhost:27017";
const port = env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
    await startApolloServer();
    app.listen(port!, () => {
      console.log(`Server is running on PORT: ${port}`);
      console.log(`GraphQL endpoint available at /graphql`);
    });
  } catch (error) {
    console.error(error);
  }
})();
