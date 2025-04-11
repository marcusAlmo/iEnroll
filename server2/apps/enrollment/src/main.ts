import { NestFactory } from '@nestjs/core';
import { EnrollmentModule } from './enrollment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EnrollmentModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'enrollment_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Start both services
  await app.listen();
  console.log('Enrollment service is running with RabbitMQ');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
