import crypto from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";

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

interface EncryptionRequestBody {
  action: "encrypt" | "decrypt";
  data?: object | EncryptedData;
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { action, data } = req.body as EncryptionRequestBody;

    if (!action) {
      return res.status(400).json({ error: "Action must be provided" });
    }

    if (action === "encrypt") {
      if (!data) {
        return res
          .status(400)
          .json({ error: "Data must be provided for encryption" });
      }
      const encryptedData = encryptData(data);
      return res.status(200).json(encryptedData);
    } else if (action === "decrypt") {
      if (!data) {
        return res
          .status(400)
          .json({ error: "Data must be provided for decryption" });
      }
      try {
        const decryptedData = decryptData(data as EncryptedData);
        return res.status(200).json(decryptedData);
      } catch (error) {
        return res.status(400).json({ error: "Failed to decrypt data" });
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
