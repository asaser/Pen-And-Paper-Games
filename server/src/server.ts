import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const uri = env.MONGODB_URI || "mongodb://localhost:27017";
const port = env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();

app.listen(port!, () => {
  console.log(`Server is running on PORT: ${port}`);
});
