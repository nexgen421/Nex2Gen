import crypto from "crypto";
import { env } from "~/env";

const ENCRYPTION_KEY = env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not defined in environment variables");
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "ENCRYPTION_KEY must be a 64-character hex string ( 32 bytes )",
  );
}

export function encryptData(data: Buffer): Buffer {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  );
  return Buffer.concat([iv, cipher.update(data), cipher.final()]);
}

export function decryptData(encryptedData: Buffer): Buffer {
  const iv = encryptedData.slice(0, 16);
  const encryptedContent = encryptedData.slice(16);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  );
  return Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
}
