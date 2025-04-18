import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import os from 'os';
import 'multer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('/api');

  const ips = getLocalExternalIps();

  const config = new DocumentBuilder()
    .setTitle('iEnroll API')
    .setDescription('API for iEnroll Enrollment System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  let corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5174',
  ];

  corsOrigins = [...corsOrigins, ...ips.map((ip) => `http://${ip}`)];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ): void => {
      try {
        const normalizedOrigin = origin
          ? new URL(origin).origin.replace(/:\d+$/, '')
          : undefined;

        const allowed =
          !normalizedOrigin ||
          corsOrigins.some((allowedOrigin) => {
            const base = new URL(allowedOrigin).origin.replace(/:\d+$/, '');
            return base === normalizedOrigin;
          });

        if (allowed) {
          callback(null, true);
        } else {
          callback(new InternalServerErrorException('Not allowed by CORS'));
        }
      } catch {
        callback(new InternalServerErrorException('Invalid origin format'));
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

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

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
    addresses.unshift('localhost');
  }

  return addresses;
}
