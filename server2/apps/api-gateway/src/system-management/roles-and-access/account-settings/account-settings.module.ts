import { Module } from '@nestjs/common';
import { AccountSettingsController } from './account-settings.controller';
import { AccountSettingsService } from './account-settings.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.SYSTEM_MANAGEMENT])],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService, ExceptionCheckerService],
})
export class AccountSettingsModule {}
