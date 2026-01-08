import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "~/env";
import { db } from "~/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      redirectURI: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/discord`,
    }
  },
  advanced: {
    useSecureCookies: false,
    cookie: {
      sameSite: "Lax",
      secure: false
    }
  }
});

export type Session = typeof auth.$Infer.Session;