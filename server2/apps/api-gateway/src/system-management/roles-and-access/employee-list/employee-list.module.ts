import { Module } from '@nestjs/common';
import { EmployeeListService } from './employee-list.service';
import { EmployeeListController } from './employee-list.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.SYSTEM_MANAGEMENT])],
  providers: [EmployeeListService, ExceptionCheckerService],
  controllers: [EmployeeListController],
})
export class EmployeeListModule {}
