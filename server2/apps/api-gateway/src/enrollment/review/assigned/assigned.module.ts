import { Module } from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { AssignedController } from './assigned.controller';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [AssignedController],
  providers: [AssignedService],
})
export class AssignedModule {}
