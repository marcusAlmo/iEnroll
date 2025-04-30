import { Module } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { ProfileSettingsController } from './profile-settings.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { AuthService } from '@lib/auth/auth.service';

@Module({
  providers: [
    ProfileSettingsService,
    PrismaService,
    MicroserviceUtilityService,
    AuthService,
  ],
  controllers: [ProfileSettingsController],
})
export class ProfileSettingsModule {}
