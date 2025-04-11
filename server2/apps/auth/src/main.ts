import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'auth_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Start both services
  await app.listen();
  console.log('Auth service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
