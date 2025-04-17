import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
