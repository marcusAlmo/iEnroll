import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'chat_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Start both services
  await app.listen();
  console.log('Chat service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
