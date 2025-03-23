import { NestFactory } from '@nestjs/core';
import { SystemManagementModule } from './system-management.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const httpApp = await NestFactory.create(SystemManagementModule);
  httpApp.setGlobalPrefix('/api/system-management');

  // Initialize microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  httpApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'system_management_queue',
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  });

  // Start both services
  await httpApp.startAllMicroservices();
  // Number(process.env.SYSTEM_MANAGEMENT_API_PORT) ||
  await httpApp.listen(Number(process.env.SYSTEM_MANAGEMENT_API_PORT) || 3003, () => {
    console.log(`System Management Service running on port ${Number(process.env.SYSTEM_MANAGEMENT_API_PORT) || 3003}`);
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
