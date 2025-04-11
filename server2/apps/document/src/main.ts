import { NestFactory } from '@nestjs/core';
import { DocumentModule } from './document.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitMqUrl, rabbitMQQueue } from '@lib/constants/rabbit-mq.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DocumentModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMQQueue.DOCUMENT,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();

  console.log('Document service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
