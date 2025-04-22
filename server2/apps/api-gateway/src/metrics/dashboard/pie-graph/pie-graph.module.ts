import { Module } from '@nestjs/common';
import { PieGraphService } from './pie-graph.service';
import { PieGraphController } from './pie-graph.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  providers: [PieGraphService, ExceptionCheckerService],
  controllers: [PieGraphController],
})
export class PieGraphModule {}
