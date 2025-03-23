import { Module } from '@nestjs/common';
import { SystemManagementController } from './system-management.controller';
import { SystemManagementService } from './system-management.service';
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
  providers: [SystemManagementService],
})
export class SystemManagementModule {}
