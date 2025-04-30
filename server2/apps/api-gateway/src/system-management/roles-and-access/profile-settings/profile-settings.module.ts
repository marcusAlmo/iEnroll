import { Module } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { ProfileSettingsController } from './profile-settings.controller';

@Module({
  providers: [ProfileSettingsService],
  controllers: [ProfileSettingsController]
})
export class ProfileSettingsModule {}
