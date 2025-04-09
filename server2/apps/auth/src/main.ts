import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('/api/auth');

  // Initialize microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'auth_queue',
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start both services
  await app.startAllMicroservices();
  // Number(process.env.ENROLLMENT_API_PORT) ||
  await app.listen(Number(process.env.ENROLLMENT_API_PORT) || 3002, () => {
    console.log(
      `Enrollment Service running on port ${Number(process.env.ENROLLMENT_API_PORT) || 3002}`,
    );
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
