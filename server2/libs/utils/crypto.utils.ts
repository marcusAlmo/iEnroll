import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';

/**
 * Utility class for handling cryptographic operations such as encryption, decryption,
 * key derivation, and random byte generation using AES-256-CBC.
 */
export class CryptoUtils {
  /**
   * The encryption algorithm used. AES-256-CBC requires a 32-byte key and a 16-byte IV.
   */
  private static readonly ALGORITHM = 'aes-256-cbc';

  /**
   * Default 32-byte hex key used if `MASTER_FILE_KEY` environment variable is not set or invalid.
   */
  private static readonly DEFAULT_HEX_KEY =
    '4f7d1b3e6a8f2c9d0b1e4c7a3f6d8e5c9b3f1e7a2c4d0a6b1d9e3c5f7a2b6d8e';

  /**
   * Derives a user-specific key by XOR-ing the master key with a salt derived from the user ID.
   *
   * @param userId - Unique identifier of the user.
   * @returns A 32-byte derived `Buffer` key unique to the user.
   */
  static getUserKey(userId: number): Buffer {
    const keyHex = process.env.MASTER_FILE_KEY?.match(/^[0-9a-fA-F]{64}$/)
      ? process.env.MASTER_FILE_KEY
      : this.DEFAULT_HEX_KEY;

    const baseKey = Buffer.from(keyHex, 'hex');
    const userSalt = Buffer.alloc(32, 0);
    userSalt.writeUInt32LE(userId, 0);

    return Buffer.from(baseKey.map((byte, i) => byte ^ userSalt[i]));
  }

  /**
   * Creates a writable stream and cipher for encrypting data to a file using AES-256-CBC.
   *
   * @param params.filePath - The output file path to write the encrypted data to.
   * @param params.key - A 32-byte encryption key.
   * @param params.iv - A 16-byte initialization vector.
   * @returns An object containing the cipher and writable stream.
   */
  static createEncryptionStream({
    filePath,
    key,
    iv,
  }: {
    filePath: string;
    key: Buffer<ArrayBuffer>;
    iv: Buffer<ArrayBuffer>;
  }) {
    const cipher = createCipheriv(this.ALGORITHM, key, iv);
    const stream = createWriteStream(filePath);

    return {
      cipher,
      stream,
    };
  }

  /**
   * Creates a readable stream and decipher for decrypting data from a file using AES-256-CBC.
   *
   * @param params.filePath - The input file path containing encrypted data.
   * @param params.key - A 32-byte decryption key.
   * @param params.iv - A 16-byte initialization vector.
   * @returns An object containing the decipher and readable stream.
   */
  static createDecryptionStream({
    filePath,
    key,
    iv,
  }: {
    filePath: string;
    key: Buffer<ArrayBuffer>;
    iv: Buffer<ArrayBuffer>;
  }) {
    const stream = createReadStream(filePath);
    const decipher = createDecipheriv(this.ALGORITHM, key, iv);

    return {
      stream,
      decipher,
    };
  }

  /**
   * Generates cryptographically secure random bytes.
   *
   * @param size - Number of random bytes to generate.
   * @returns A `Buffer` containing the random bytes.
   */
  static createRandomBytes(size: number) {
    return randomBytes(size);
  }
}
