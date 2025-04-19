import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import os from 'os';
import 'multer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('/api');

  const SWAGGER_ENDPOINT = 'api/docs';

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const isProd = process.env.NODE_ENV === 'production';

  const ips = getLocalIps(isProd);

  // Swagger (only in dev)
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('iEnroll API')
      .setDescription('API for iEnroll Enrollment System')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(SWAGGER_ENDPOINT, app, document);
  }

  // CORS
  let corsOrigins =
    process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) || [];

  const ipOrigins = ips.map((ip) => `http://${ip}:${port}`);
  corsOrigins = Array.from(new Set([...corsOrigins, ...ipOrigins]));

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, host);

  console.log(`✅ API Gateway is running on:`);
  ips.forEach((ip) => {
    console.log(`→ http://${ip}:${port}`);
  });

  if (!isProd) {
    console.log(
      `🧪 Swagger docs: http://localhost:${port}/${SWAGGER_ENDPOINT}`,
    );
  }
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});

function getLocalIps(isProd: boolean): string[] {
  const interfaces = os.networkInterfaces();
  const seen = new Set<string>();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        !seen.has(iface.address)
      ) {
        seen.add(iface.address);
        ips.push(iface.address);
      }
    }
  }

  if (!isProd) {
    ['localhost', '127.0.0.1'].forEach((local) => {
      if (!seen.has(local)) {
        seen.add(local);
        ips.unshift(local);
      }
    });
  }

  return ips;
}
