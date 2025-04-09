import { Module } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService, LandingService],
  controllers: [LandingController],
})
export class LandingModule {}
