import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './metrics.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const httpApp = await NestFactory.create(MetricsModule);
  httpApp.setGlobalPrefix('/api/metrics');

  // Initialize microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  httpApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'metrics_queue',
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  });

  // Start both services
  await httpApp.startAllMicroservices();
  // Number(process.env.METRICS_API_PORT) ||
  await httpApp.listen(3004);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
