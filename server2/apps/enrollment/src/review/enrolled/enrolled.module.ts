import { Module } from '@nestjs/common';
import { EnrolledService } from './enrolled.service';
import { EnrolledController } from './enrolled.controller';

@Module({
  controllers: [EnrolledController],
  providers: [EnrolledService],
})
export class EnrolledModule {}
