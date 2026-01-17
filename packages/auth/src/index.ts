import { db } from "@veterinary-app/db";
import { env } from "@veterinary-app/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { ObjectId } from "mongodb";


export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production",
      httpOnly: true,
    },
    database: {
      generateId() {
        return new ObjectId().toString();
      },
    },
  },
});
