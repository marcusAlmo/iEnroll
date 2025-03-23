import { Module } from '@nestjs/common';
import { SystemManagementController } from './system-management.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
  ],
  controllers: [SystemManagementController],
  providers: [],
})
export class SystemManagementModule {}
