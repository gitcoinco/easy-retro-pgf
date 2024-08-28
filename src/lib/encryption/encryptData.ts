import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const iv = crypto.randomBytes(16); // generate a random initialization vector

if (!key) {
  throw new Error("ENCRYPTION_KEY is not set");
}
interface EncryptedData {
  iv: string;
  data: string;
}

export const encryptData = (data: object): EncryptedData => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    data: encrypted,
  };
};

export const decryptData = (encryptedData: EncryptedData): object => {
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

export const generateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
