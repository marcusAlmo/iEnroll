import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

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
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { username },
      select: { user_id: true, username: true, password_hash: true },
    });

    if (!user) return -1;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch ? { userId: user.user_id, username: user.username } : -2;
  }

  async login(user: { userId: number; username: string }) {
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
