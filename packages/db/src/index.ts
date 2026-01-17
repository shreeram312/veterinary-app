import { env } from "@veterinary-app/env/server";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const dbName = "myDB";

await mongoose.connect(env.DATABASE_URL, { dbName }).catch((error) => {
  console.log("Error connecting to database:", error);
});

const client = new MongoClient(env.DATABASE_URL);
await client.connect();
const db = client.db(dbName);

export { client, db };
export * from "./models/auth.model";
