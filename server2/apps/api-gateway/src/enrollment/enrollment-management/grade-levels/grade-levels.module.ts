import { Module } from '@nestjs/common';
import { GradeLevelsController } from './grade-levels.controller';
import { GradeLevelsService } from './grade-levels.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [GradeLevelsController],
  providers: [GradeLevelsService, ExceptionCheckerService],
})
export class GradeLevelsModule {}
