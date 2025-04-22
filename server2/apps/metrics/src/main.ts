import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './metrics.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MetricsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMQQueue.METRICS,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log('Metrics service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
