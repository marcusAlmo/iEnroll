import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
  ],
  controllers: [MetricsController],
  providers: [],
})
export class MetricsModule {}
