import { env } from "@/env";
import { routes } from "@/lib/routes";
import type { SessionUser, User } from "@/types/api";
import axios from "axios";
import type { Session } from "next-auth";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

class LoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    data: SessionUser["data"];
    accessToken: string;
    id?: string;
  }
  interface Session extends DefaultSession {
    user: SessionUser["data"]["user"];
    token: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const apiUrl = `${env.NEXT_PUBLIC_API_URL}auth/signin`;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (
          axios
            .post(apiUrl, {
              email: credentials?.email,
              password: credentials?.password,
            })
            .then((response) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
              return response.data?.data;
            })
            .catch((error) => {
              const e = new LoginError();
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              e.code = error?.response?.data?.message;
              throw e;
            }) ?? null
        );
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT & { user?: User; token?: string };
      user?: {
        data?: { user: User; accessToken: string };
        user?: User;
        accessToken?: string;
      };
      trigger?: "signIn" | "signUp" | "update";
      session?: Partial<User>;
    }) {
      if (user) {
        token.user = user.data?.user ?? user.user;
        token.token = user.data?.accessToken ?? user.accessToken;
      }

      if (trigger === "update" && session && token.user) {
        token.user = { ...token.user, ...session };
      }
      return token;
    },
    session: ({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { user?: User; token?: string };
    }) => {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
        session.token = token.token!;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  secret: env.AUTH_SECRET,
  pages: {
    signIn: routes.auth.login,
  },
  trustHost: true,
} satisfies NextAuthConfig;
