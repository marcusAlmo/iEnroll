import { Module } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { ProfileSettingsController } from './profile-settings.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.SYSTEM_MANAGEMENT])],
  providers: [ProfileSettingsService, ExceptionCheckerService],
  controllers: [ProfileSettingsController],
})
export class ProfileSettingsModule {}
