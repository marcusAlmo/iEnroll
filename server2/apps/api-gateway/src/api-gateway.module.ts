<<<<<<< HEAD
import {
  ArgumentsHost,
  ExceptionFilter,
  Injectable,
  Module,
  Logger,
} from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { CircuitBreakerService } from '@libs/circuit-breaker/circuit-breaker.service';
import { HealthController } from '@libs/health/src/health.controller';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@libs/health/src/health.module';
import { CircuitBreakerModule } from '@libs/circuit-breaker/circuit-breaker.module';
import { PrismaModule } from '@libs/prisma/src/prisma.module';
import { PrismaHealthModule } from '@libs/prisma/src/prisma-health.module';

@Injectable()
export class CircuitBreakerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('CircuitBreaker');

  catch(exception: Error, _: ArgumentsHost) {
    this.logger.error(`Service failure: ${exception.message}`);
  }
}

@Module({
  imports: [
    TerminusModule,
    CircuitBreakerModule,
    ClientsModule.registerAsync([
      {
        name: 'CHAT_SERVICE',
        useFactory: (breaker: CircuitBreakerService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: 'chat_queue',
              queueOptions: {
                durable: true,
                persistent: true,
              },
              // prettier-ignore
              middleware: [breaker.createBreaker('chat', () => {}, {
                timeout: 5000,
                errorThresholdPercentage: 50,
                resetTimeout: 30000
              })],
              socketOptions: {
                heartbeatInterval: 30000,
              },
              resilience: {
                retry: {
                  maxAttempts: 3,
                  interval: 1000,
                  timeout: 5000,
                },
                circuitBreaker: {
                  windowDuration: 10000,
                  failureThreshold: 3,
                  openStateDuration: 30000,
                },
              },
            },
          };
        },
        inject: [CircuitBreakerService],
      },
      {
        name: 'ENROLLMENT_SERVICE',
        imports: [CircuitBreakerModule], // ✅ Ensure the module is imported
        inject: [CircuitBreakerService], // ✅ Explicitly inject the service
        useFactory: (breaker: CircuitBreakerService) => {
          if (!breaker)
            throw new Error('CircuitBreakerService is not initialized'); // Debugging check
          return {
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: 'enrollment_queue',
              queueOptions: { durable: true, persistent: true },
              middleware: [
                // prettier-ignore
                breaker.createBreaker('enrollment', async () => { /* your logic */ }, {
                  timeout: 5000,
                  errorThresholdPercentage: 50,
                  resetTimeout: 30000,
                }),
              ],
            },
          };
        },
      },
      {
        name: 'SYSTEM_MANAGEMENT_SERVICE',
        useFactory: (breaker: CircuitBreakerService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: 'system_management_queue',
              queueOptions: {
                durable: true,
                persistent: true,
              },
              // prettier-ignore
              middleware: [breaker.createBreaker('system_management', () => {}, {
                timeout: 5000,
                errorThresholdPercentage: 50,
                resetTimeout: 30000
              })],
              socketOptions: {
                heartbeatInterval: 30000,
              },
              resilience: {
                retry: {
                  maxAttempts: 3,
                  interval: 1000,
                  timeout: 5000,
                },
                circuitBreaker: {
                  windowDuration: 10000,
                  failureThreshold: 3,
                  openStateDuration: 30000,
                },
              },
            },
          };
        },
        inject: [CircuitBreakerService],
      },
      {
        name: 'METRICS_SERVICE',
        useFactory: (breaker: CircuitBreakerService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: 'metrics_queue',
              queueOptions: {
                durable: true,
                persistent: true,
              },
              // prettier-ignore
              middleware: [breaker.createBreaker('metrics', () => {}, {
                timeout: 5000,
                errorThresholdPercentage: 50,
                resetTimeout: 30000
              })],
              socketOptions: {
                heartbeatInterval: 30000,
              },
              resilience: {
                retry: {
                  maxAttempts: 3,
                  interval: 1000,
                  timeout: 5000,
                },
                circuitBreaker: {
                  windowDuration: 10000,
                  failureThreshold: 3,
                  openStateDuration: 30000,
                },
              },
            },
          };
        },
        inject: [CircuitBreakerService],
      },
    ]),
    CircuitBreakerModule,
    PrismaModule,
    HealthModule,
    PrismaHealthModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CircuitBreakerExceptionFilter,
    },
    CircuitBreakerService,
  ],
=======
import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';

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
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'enrollment_queue',
          queueOptions: {
            durable: true,
            persistent: true,
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
>>>>>>> dev-front-merge
})
export class ApiGatewayModule {}
