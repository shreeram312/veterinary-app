import { env } from "@veterinary-app/env/server";
import mongoose from "mongoose";

const dbName = "myDB";

await mongoose.connect(env.DATABASE_URL, { dbName }).catch((error) => {
  console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db(dbName);

export { client };
export * from "./models/auth.model";
