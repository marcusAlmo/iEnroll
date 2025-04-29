import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  providers: [RequirementsService, ExceptionCheckerService],
  controllers: [RequirementsController],
})
export class RequirementsModule {}
