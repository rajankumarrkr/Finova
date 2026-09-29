import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-cbc';

/**
 * Returns the validated 32-byte encryption key buffer.
 * Accepts:
 * - 64-character hexadecimal string (preferred)
 * - 32-byte Base64 string
 * - Raw 32-byte string
 * Throws a clear Error if key is invalid or not 32 bytes.
 */
export const getEncryptionKey = () => {
  const rawKey = process.env.BANK_ENCRYPTION_KEY || env.BANK_ENCRYPTION_KEY;

  if (!rawKey || typeof rawKey !== 'string') {
    throw new Error(
      'BANK_ENCRYPTION_KEY environment variable is missing. Please set BANK_ENCRYPTION_KEY to a 64-character hexadecimal string (32 bytes).'
    );
  }

  const trimmed = rawKey.trim();
  let keyBuffer;

  // 1. Check if 64-char Hex string (32 bytes)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    keyBuffer = Buffer.from(trimmed, 'hex');
  } 
  // 2. Check if Base64 string decoding yields 32 bytes
  else if (Buffer.from(trimmed, 'base64').length === 32) {
    keyBuffer = Buffer.from(trimmed, 'base64');
  } 
  // 3. Fallback buffer check for raw string
  else {
    keyBuffer = Buffer.from(trimmed, 'utf8');
  }

  if (keyBuffer.length !== 32) {
    throw new Error(
      `BANK_ENCRYPTION_KEY must represent exactly 32 bytes (64 hexadecimal characters). Received ${keyBuffer.length} bytes.`
    );
  }

  return keyBuffer;
};

/**
 * Validates the encryption key configuration during application startup.
 */
export const validateEncryptionKey = () => {
  try {
    const keyBuffer = getEncryptionKey();
    if (!keyBuffer || keyBuffer.length !== 32) {
      throw new Error('BANK_ENCRYPTION_KEY validation failed: Key length is not 32 bytes.');
    }
    return true;
  } catch (error) {
    console.error('[Configuration Error]: BANK_ENCRYPTION_KEY is invalid:', error.message);
    throw error;
  }
};

/**
 * Encrypts a string using AES-256-CBC with a random 16-byte IV.
 * Returns IV and ciphertext joined by a colon ("ivHex:cipherHex").
 */
export const encrypt = (text) => {
  if (!text) return text;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Decrypts an encrypted string formatted as "ivHex:cipherHex" or legacy fixed IV.
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;

  try {
    const key = getEncryptionKey();

    if (typeof encryptedText === 'string' && encryptedText.includes(':')) {
      const [ivHex, cipherHex] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }

    // Fallback for legacy records formatted with 16 zero-byte IV
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // Return original string if decryption fails or for mock seed data
    return encryptedText;
  }
};
