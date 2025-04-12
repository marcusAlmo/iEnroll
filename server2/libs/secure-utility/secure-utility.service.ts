import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class SecureUtilityService {
  private static algorithm = 'aes-256-cbc';
  private static ivLength = 16;
  private static keyLength = 32;

  private static generateKeyAndIV() {
    const key = randomBytes(this.keyLength);
    const iv = randomBytes(this.ivLength);
    return { key, iv };
  }

  public static encrypt(text: string): string {
    const { key, iv } = this.generateKeyAndIV();
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // eslint-disable-next-line
    const combined = [
        encrypted,
        iv.toString('hex'),
        key.toString('hex')
    ].join(':');

    return combined;
  }

  public static decrypt(combined: string): string {
    const [encryptedHex, ivHex, keyHex] = combined.split(':');
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
