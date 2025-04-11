import { Module } from '@nestjs/common';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [EnrollController],
  providers: [EnrollService],
})
export class EnrollModule {}
