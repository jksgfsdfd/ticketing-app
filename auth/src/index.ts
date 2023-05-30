import mongoose from "mongoose";
import { app } from "./app";

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to connect to MongoDB");
  }

  app.listen(3000, () => {
    console.log("Server started on PORT 3000");
  });
}

start();
