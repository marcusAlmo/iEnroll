import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<Prisma.userGetPayload<{ select: { username: true; user_id: true } }>[]> {
    return this.prisma.user.findMany({
      select: {
        username: true,
        user_id: true,
      },
    });
  }
}
