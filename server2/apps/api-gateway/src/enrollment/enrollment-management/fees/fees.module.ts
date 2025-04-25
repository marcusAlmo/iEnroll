import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  providers: [FeesService, ExceptionCheckerService],
  controllers: [FeesController],
})
export class FeesModule {}
