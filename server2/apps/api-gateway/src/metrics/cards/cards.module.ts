import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  providers: [CardsService, ExceptionCheckerService],
  controllers: [CardsController],
})
export class CardsModule {}
