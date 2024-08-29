import crypto from "crypto";
import { useMutation } from "@tanstack/react-query";

export interface EncryptedData {
  iv: string;
  data: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function encryptionApiRequest<T>(
  action: "encrypt" | "decrypt",
  data?: object | EncryptedData,
): Promise<ApiResponse<T>> {
  const response = await fetch("/api/encryption", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error: string };
    throw new Error(errorData.error || "Request failed");
  }

  const resultData = (await response.json()) as T;
  return { success: true, data: resultData };
}

export function useEncryption<T>() {
  return useMutation<
    ApiResponse<T>,
    Error,
    { action: "encrypt" | "decrypt"; data?: object | EncryptedData }
  >({
    mutationFn: ({ action, data }) => encryptionApiRequest<T>(action, data),
  });
}

export const generateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
