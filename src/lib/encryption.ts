import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM

function getKey(): Buffer {
  const hex = process.env.PII_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "PII_ENCRYPTION_KEY must be set to a 64-character hex string (32 bytes). " +
        "Generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string: iv:authTag:ciphertext
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Decrypt a base64-encoded iv:authTag:ciphertext string.
 * Returns the original plaintext.
 */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  const [ivB64, authTagB64, encryptedB64] = ciphertext.split(":");

  if (!ivB64 || !authTagB64 || !encryptedB64) {
    throw new Error("Invalid encrypted format");
  }

  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Encrypt a value if it's a non-empty string, otherwise return null.
 * Use this for optional PII fields like phone.
 */
export function encryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null;
  return encrypt(value);
}

/**
 * Decrypt a value if it's a non-empty string, otherwise return null.
 */
export function decryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return decrypt(value);
  } catch {
    // If decryption fails (e.g. plaintext stored before encryption was added), return as-is
    return value;
  }
}
