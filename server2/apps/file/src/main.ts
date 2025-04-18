import { NestFactory } from '@nestjs/core';
import { FileModule } from './file.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rabbitMqUrl, rabbitMQQueue } from '@lib/constants/rabbit-mq.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMQQueue.FILE,
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
