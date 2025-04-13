import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors({
    origin: 'http://localhost:5174',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  app.setGlobalPrefix('/api');
  console.log('API Gateway is running on: http://localhost:3000');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
