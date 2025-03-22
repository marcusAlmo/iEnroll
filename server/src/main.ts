import session from 'express-session';
import * as Redis from 'ioredis'; // Corrected import
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { LoggerService } from './logger/logger.service.js';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useLogger(app.get(LoggerService));
  app.setGlobalPrefix('/api');
  app.enableCors();

  const { default: connectRedis } = await import('connect-redis');

  // Proper Redis client initialization
  const redisClient = new (Redis as any).default({
    host: 'localhost',
    port: 6379,
  });

  const RedisStore = connectRedis(session);
  const store = new RedisStore({
    client: redisClient,
    disableTouch: true,
  });

  app.use(
    session({
      store,
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as session.SessionOptions),
  );

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
