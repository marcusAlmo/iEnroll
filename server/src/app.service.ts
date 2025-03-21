import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service.js';
import { user } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<Pick<user, 'username' | 'user_id'>[]> {
    return await this.prisma.user.findMany({
      select: {
        username: true,
        user_id: true,
      },
    });
  }
}
