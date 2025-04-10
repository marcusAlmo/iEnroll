import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  //   async register(username: string, password: string): Promise<any> {
  //     // Add logic to register a new user
  //     // Example: Save user to a database
  //     return { id: 2, username }; // Return the created user object
  //   }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async validateUserById(userId: number) {
    // Add logic to validate user by ID
    return await this.prisma.user.findFirst({
      select: {
        user_id: true,
        username: true,
        // password_hash: true,
      },
      where: { user_id: userId },
    });
  }
}
