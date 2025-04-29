import { Module } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { ProfileSettingsController } from './profile-settings.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { StringUtilityService } from '@lib/string-utility/string-utility.service';

@Module({
  providers: [
    ProfileSettingsService,
    PrismaService,
    MicroserviceUtilityService,
    StringUtilityService,
  ],
  controllers: [ProfileSettingsController],
})
export class ProfileSettingsModule {}
