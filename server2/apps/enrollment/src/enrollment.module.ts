import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
  ],
  controllers: [EnrollmentController],
  providers: [],
})
export class EnrollmentModule {}
