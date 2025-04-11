import { Module } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { EnrollController } from './enroll.controller';

@Module({
  providers: [EnrollService],
  controllers: [EnrollController],
})
export class EnrollModule {}
