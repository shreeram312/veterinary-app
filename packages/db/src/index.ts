import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { env } from "@veterinary-app/env/server";

const client = new MongoClient(env.DATABASE_URL);

// Connect native MongoDB client
client.connect().then(() => {
  console.log("MongoDB native client connected");
}).catch((err) => {
  console.error("MongoDB native client connection error:", err);
});

// Connect Mongoose for models
mongoose.connect(env.DATABASE_URL).then(() => {
  console.log("Mongoose connected");
}).catch((err) => {
  console.error("Mongoose connection error:", err);
});

const db = client.db();

export { db, client };