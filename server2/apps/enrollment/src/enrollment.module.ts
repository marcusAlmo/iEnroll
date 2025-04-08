import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountModule } from './create-account/create-account.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    CreateAccountModule,
  ],
  controllers: [EnrollmentController],
  providers: [],
})
export class EnrollmentModule {}
