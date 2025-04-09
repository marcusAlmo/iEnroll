import { Module } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { EnrollController } from './enroll.controller';
import { AuthModule } from '@lib/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EnrollService],
  controllers: [EnrollController],
})
export class EnrollModule {}
