import { Module } from '@nestjs/common';
import { AccountSettingsController } from './account-settings.controller';
import { AccountSettingsService } from './account-settings.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { AuthService } from '@lib/auth/auth.service';

@Module({
  controllers: [AccountSettingsController],
  providers: [
    AccountSettingsService,
    PrismaService,
    MicroserviceUtilityService,
    AuthService,
  ],
})
export class AccountSettingsModule {}
