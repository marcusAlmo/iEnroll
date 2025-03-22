import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module.js';

@Module({
  // prettier-ignore
  imports: [
    UsersModule, 
    AuthModule, 
    DatabaseModule,
    ThrottlerModule.forRoot([{
      name: 'shortRequest',
      ttl: 1000,
      limit: 3,
    }, {
      name: 'longRequest',
      ttl: 60000,
      limit: 100,
    }]),
    LoggerModule,
  ],
  controllers: [AppController],
  // prettier-ignore
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }],
})
export class AppModule {}
