import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const raw = process.env.META_TOKEN_ENCRYPTION_KEY;

  if (!raw) {
    throw new Error(
      "META_TOKEN_ENCRYPTION_KEY no está configurada. Añade una clave de 32 bytes en base64 al entorno.",
    );
  }

  // Accept either a raw 32-char string or a base64-encoded 32-byte key
  const buf = Buffer.from(raw, "base64");

  if (buf.length === 32) return buf;

  // Fallback: SHA-256 hash of the raw string to always get 32 bytes
  return createHash("sha256").update(raw).digest();
}

/**
 * Encrypt a plaintext string.
 * Returns a base64url-encoded string: iv (12 bytes) + tag (16 bytes) + ciphertext
 */
export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

/**
 * Decrypt a token previously encrypted with encryptToken.
 */
export function decryptToken(ciphertext: string): string {
  const key = getEncryptionKey();
  const buf = Buffer.from(ciphertext, "base64url");

  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = buf.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final("utf8");
}
