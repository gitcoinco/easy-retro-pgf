import crypto from "crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  protectedProcedure,
  adminProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY; // Use a server-side environment variable

if (!key) {
  throw new Error("ENCRYPTION_KEY is not set");
}

if (key.length !== 64) {
  throw new Error("ENCRYPTION_KEY must be 32 bytes long");
}

interface EncryptedData {
  iv: string;
  data: string;
}

const encryptData = (data: object): EncryptedData => {
  const iv = crypto.randomBytes(16); // generate a random initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    data: encrypted,
  };
};

const decryptData = (encryptedData: EncryptedData): object => {
  const iv = Buffer.from(encryptedData.iv, "hex");
  const encryptedText = encryptedData.data;
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    iv,
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted) as object;
};

export const encryptionRouter = createTRPCRouter({
  decrypt: adminProcedure
    .input(z.object({ iv: z.string(), data: z.string() }))
    .mutation(({ input }) => {
      try {
        const decrypted = decryptData(input);
        return { decrypted };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to decrypt data",
        });
      }
    }),

  encrypt: protectedProcedure
    .input(z.object({}).passthrough())
    .mutation(({ input }) => {
      try {
        const encrypted = encryptData(input);
        return encrypted;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to encrypt data",
        });
      }
    }),
});
