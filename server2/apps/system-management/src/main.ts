import { NestFactory } from '@nestjs/core';
import { SystemManagementModule } from './system-management.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SystemManagementModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMQQueue.SYSTEM_MANAGEMENT,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Start both services
  await app.listen();
  console.log('System Management service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
