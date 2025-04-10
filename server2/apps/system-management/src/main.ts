import { NestFactory } from '@nestjs/core';
import { SystemManagementModule } from './system-management.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SystemManagementModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'system_management_queue',
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
