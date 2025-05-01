import { Module } from '@nestjs/common';
import { EnrolledService } from './enrolled.service';
import { EnrolledController } from './enrolled.controller';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [EnrolledController],
  providers: [EnrolledService],
})
export class EnrolledModule {}
