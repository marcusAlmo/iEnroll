import { Module } from '@nestjs/common';
import { DeniedService } from './denied.service';
import { DeniedController } from './denied.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  controllers: [DeniedController],
  providers: [DeniedService, PrismaService],
})
export class DeniedModule {}
