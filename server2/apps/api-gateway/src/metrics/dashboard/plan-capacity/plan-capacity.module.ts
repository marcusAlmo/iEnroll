import { Module } from '@nestjs/common';
import { PlanCapacityService } from './plan-capacity.service';
import { PlanCapacityController } from './plan-capacity.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
  controllers: [PlanCapacityController],
  providers: [PlanCapacityService, ExceptionCheckerService],
})
export class PlanCapacityModule {}
