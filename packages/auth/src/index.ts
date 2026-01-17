import { db } from "@veterinary-app/db";
import { env } from "@veterinary-app/env/server";
import { betterAuth } from "better-auth"; 
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db } from "mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db as unknown as Db),
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
  },
});
