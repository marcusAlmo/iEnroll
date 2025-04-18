import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import os from 'os';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(ApiGatewayModule);

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5174',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ): void => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('/api');

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  const ips = getLocalExternalIps();
  console.log(`✅ API Gateway is running on:`);
  ips.forEach((ip) => {
    console.log(`→ http://${ip}:${port}`);
  });
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

function getLocalExternalIps(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    addresses.unshift('127.0.0.1');
  }

  return addresses;
}
