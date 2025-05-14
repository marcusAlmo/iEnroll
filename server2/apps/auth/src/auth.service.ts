import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@lib/auth/interfaces/jwt-payload.interface';
import { SecureUtilityService } from '@lib/secure-utility/secure-utility.service';

interface UserType {
  user_id: number;
  username: string;
  password_hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private FALLBACK_SECRET = 'supersecret';
  private FALLBACK_ESPIRES_IN = '7d';

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Validates a user's credentials by checking the provided username and password.
   *
   * @param username - The username of the user attempting to authenticate.
   * @param password - The plaintext password provided by the user.
   * @returns A promise that resolves to:
   * - An object containing the user's ID and username if the credentials are valid.
   * - `-1` if the user does not exist.
   * - `-2` if the password is incorrect.
   *
   * @throws Will propagate any errors encountered during the database query or password comparison.
   */
  async validateUser({
    password,
    username,
    email,
    emailEntered,
  }: {
    password: string;
    username?: string;
    email?: string;
    emailEntered?: string;
  }) {
    if (!username && !email) {
      throw new Error('Username or email is required');
    }

    let user: UserType | null = null;

    if (username) {
      user = await this.prisma.user.findFirst({
        where: { username },
        select: { user_id: true, username: true, password_hash: true },
      });
    } else if (email) {
      const decryptedEmail = SecureUtilityService.decrypt(email);
      console.log(
        decryptedEmail,
        emailEntered,
        decryptedEmail === emailEntered,
      );

      const isEmailMatch: boolean = decryptedEmail === emailEntered;

      if (isEmailMatch) {
        user = await this.prisma.user.findFirst({
          where: { email_address: decryptedEmail },
          select: { user_id: true, username: true, password_hash: true },
        });
      }
    }

    if (!user) return -1;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch ? { userId: user.user_id, username: user.username } : -2;
  }

  async login(user: {
    userId: number;
    username: string;
  }): Promise<{ access_token: string }> {
    console.debug('Login user:', user);
    const payload: JwtPayload = { sub: user.userId, username: user.username };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET ?? this.FALLBACK_SECRET,
        expiresIn: process.env.JWT_EXPIRATION ?? this.FALLBACK_ESPIRES_IN,
      }),
    };
  }
}
