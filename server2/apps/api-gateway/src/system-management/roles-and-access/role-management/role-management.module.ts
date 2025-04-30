import { Module } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagementController } from './role-management.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.SYSTEM_MANAGEMENT])],
  providers: [RoleManagementService, ExceptionCheckerService],
  controllers: [RoleManagementController],
})
export class RoleManagementModule {}
