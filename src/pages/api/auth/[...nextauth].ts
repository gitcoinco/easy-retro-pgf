import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { IncomingMessage } from "http";
import { genKeyPair } from "maci-cli/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { db } from "~/server/db";

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message ?? "{}") as Partial<SiweMessage>,
          );

          const nextAuthUrl = parseUrl(
            process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL,
          ).origin;

          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          await siwe.verify({ signature: credentials?.signature ?? "" });
          
          const keypair = genKeyPair({
            seed: credentials?.signature
              ? BigInt(credentials.signature)
              : undefined,
          });

          return {
            id: JSON.stringify({
              address: siwe.address,
              publicKey: keypair.publicKey,
              privateKey: keypair.privateKey,
            }),
          };
        } catch (e) {
          return null;
        }
      },
      credentials: {
        message: {
          label: "Message",
          placeholder: "0x0",
          type: "text",
        },
        signature: {
          label: "Signature",
          placeholder: "0x0",
          type: "text",
        },
      },
      name: "Ethereum",
    }),
  ];

  return {
    adapter: PrismaAdapter(db),
    callbacks: {
      async session({ session, token }) {
        try {
          type ExtendedSession = Partial<{
            address: string;
            publicKey: string;
            privateKey: string;
          }>;

          const { address, publicKey, privateKey } = JSON.parse(
            token.sub ?? "{}",
          ) as ExtendedSession;
          (session as ExtendedSession).address = address;
          (session as ExtendedSession).publicKey = publicKey;
          (session as ExtendedSession).privateKey = privateKey;
          (
            session as {
              user?: { name?: string; publicKey?: string; privateKey?: string };
            }
          ).user = {
            name: address,
            publicKey,
            privateKey,
          };
        } catch (e) {
          console.error(`Can't return session ${(e as Error).message}`);
        } finally {
          return session;
        }
      },
    },
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
  };
}

function parseUrl(url?: string): {
  /** @default "http://localhost:3000" */
  origin: string;
  /** @default "localhost:3000" */
  host: string;
  /** @default "/api/auth" */
  path: string;
  /** @default "http://localhost:3000/api/auth" */
  base: string;
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string;
} {
  const defaultUrl = new URL("http://localhost:3000/api/auth");

  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }

  const _url = new URL(url ?? defaultUrl);
  const path = (_url.pathname === "/" ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, "");

  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const authOptions = getAuthOptions(req);

  if (!Array.isArray(req.query.nextauth)) {
    res.status(400).send("Bad request");
    return;
  }

  const isDefaultSigninPage =
    req.method === "GET" &&
    req.query.nextauth.find((value) => value === "signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    authOptions.providers.pop();
  }

  return (await NextAuth(req, res, authOptions)) as typeof NextAuth;
}
