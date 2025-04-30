import { Module } from '@nestjs/common';
import { DeniedService } from './denied.service';
import { DeniedController } from './denied.controller';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [DeniedController],
  providers: [DeniedService],
})
export class DeniedModule {}
