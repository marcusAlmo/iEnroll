import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const httpApp = await NestFactory.create(ChatModule);

  // Initialize microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  httpApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'chat_queue',
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  });

  console.log('ENV PORT VALUES:');
  console.log({
    API_GATEWAY_PORT: process.env.API_GATEWAY_PORT,
    CHAT_API_PORT: process.env.CHAT_API_PORT,
    NESTJS_PORT: process.env.PORT, // Some frameworks use generic PORT variable
  });

  // Start both services
  await httpApp.startAllMicroservices();
  // Number(process.env.CHAT_API_PORT) ||
  await httpApp.listen(3001, () => {
    console.log(`Chat Service running on port ${3001}`);
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
