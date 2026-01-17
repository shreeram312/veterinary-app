import { client, db } from "@veterinary-app/db";
import { env } from "@veterinary-app/env/server";
import { betterAuth } from "better-auth"; 
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { ObjectId } from "mongodb";


export const auth = betterAuth({
  database: mongodbAdapter(db , {
      client: client,
  } ),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId() {
        return new ObjectId().toString();
      },
    },    
  },
});
