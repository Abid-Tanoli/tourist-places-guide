import crypto from "crypto";

// Dedicated encryption key for CNIC/Passport — independent from JWT secrets
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (key) {
    return crypto.createHash("sha256").update(key).digest();
  }
  // Fallback only for development — never use in production
  console.warn("ENCRYPTION_KEY not set — using fallback key. Set ENCRYPTION_KEY in .env for production.");
  return crypto.createHash("sha256").update("fallback_secret_key_at_least_32_chars").digest();
};

const ALGORITHM = "aes-256-cbc";

export const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (err) {
    console.error("Encryption failed:", err);
    return text;
  }
};

export const decrypt = (text) => {
  if (!text || !text.includes(":")) return text;
  try {
    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    // If decryption fails, return original text (useful for transition of unencrypted legacy values)
    return text;
  }
};
