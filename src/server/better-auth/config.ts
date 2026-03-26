import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "~/env";
import { db } from "~/server/db";

const socialProviders = {
  ...(env.BETTER_AUTH_GITHUB_CLIENT_ID &&
  env.BETTER_AUTH_GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
          redirectURI: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
        },
      }
    : {}),
  ...(env.BETTER_AUTH_DISCORD_CLIENT_ID &&
  env.BETTER_AUTH_DISCORD_CLIENT_SECRET
    ? {
        discord: {
          clientId: env.BETTER_AUTH_DISCORD_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
          redirectURI: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/discord`,
        },
      }
    : {}),
};

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    cookie: {
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
