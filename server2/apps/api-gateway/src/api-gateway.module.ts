import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { GoogleStrategyModule } from '@lib/google-strategy/google.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { SystemManagementController } from './system-management/system-management.controller';
import { SystemManagementService } from './system-management/system-management.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { EnrollmentController } from './enrollment/enrollment.controller';
import { EnrollmentService } from './enrollment/enrollment.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'chat_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
      {
        name: 'ENROLLMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'enrollment_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
      {
        name: 'METRICS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'metrics_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
      {
        name: 'SYSTEM_MANAGEMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'system_management_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
    ]),
    GoogleStrategyModule,
  ],
  controllers: [
    ApiGatewayController,
    MetricsController,
    SystemManagementController,
    ChatController,
    EnrollmentController,
    AuthController,
  ],
  providers: [
    ApiGatewayService,
    MetricsService,
    SystemManagementService,
    ChatService,
    EnrollmentService,
    AuthService,
  ],
})
export class ApiGatewayModule {}
