import { Module } from '@nestjs/common';
import { CreateAccountController } from './create-account.controller';
import { CreateAccountService } from './create-account.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [CreateAccountController],
  providers: [CreateAccountService],
})
export class CreateAccountModule {}
