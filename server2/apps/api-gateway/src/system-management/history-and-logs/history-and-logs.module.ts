import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { Module } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { HistoryAndLogsController } from './history-and-logs.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([rabbitMQConstants.SYSTEM_MANAGEMENT])],
  providers: [HistoryAndLogsService, ExceptionCheckerService],
  controllers: [HistoryAndLogsController],
})
export class HistoryAndLogsModule {}
