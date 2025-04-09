import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const httpApp = await NestFactory.create(ChatModule);
  httpApp.setGlobalPrefix('/api/chat');

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

  // Start both services
  await httpApp.startAllMicroservices();
  // Number(process.env.CHAT_API_PORT) ||
  await httpApp.listen(Number(process.env.CHAT_API_PORT) || 3001, () => {
    console.log(
      `Chat Service running on port ${Number(process.env.CHAT_API_PORT) || 3001}`,
    );
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
