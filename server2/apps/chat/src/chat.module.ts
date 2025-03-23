import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from 'libs/prisma/src/prisma.module';
import { HealthModule } from 'libs/health/src/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    PrismaModule,
    HealthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
