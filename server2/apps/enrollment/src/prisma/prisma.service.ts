/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  //   // Optional helper for test cleanup
  //   async cleanDatabase() {
  //     // Clear tables respecting foreign keys
  //     await this.$transaction([
  //       this.user.deleteMany(),
  //       // add other models here like this.post.deleteMany()
  //     ]);
  //   }
}
