import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(3000);
  app.setGlobalPrefix('/api');
  console.log('API Gateway is running on: http://localhost:3000');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
