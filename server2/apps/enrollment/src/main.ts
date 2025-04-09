import { NestFactory } from '@nestjs/core';
import { EnrollmentModule } from './enrollment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create HTTP adapter for health checks
  const httpApp = await NestFactory.create(EnrollmentModule);
  httpApp.setGlobalPrefix('/api/enrollment');

  // Initialize microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  httpApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'enrollment_queue',
      queueOptions: {
        durable: true,
        persistent: true,
      },
    },
  });

  httpApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Start both services
  await httpApp.startAllMicroservices();
  // Number(process.env.ENROLLMENT_API_PORT) ||
  await httpApp.listen(Number(process.env.ENROLLMENT_API_PORT) || 3002, () => {
    console.log(
      `Enrollment Service running on port ${Number(process.env.ENROLLMENT_API_PORT) || 3002}`,
    );
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
