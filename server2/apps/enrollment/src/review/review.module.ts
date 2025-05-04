import { Module } from '@nestjs/common';
import { AssignedModule } from './assigned/assigned.module';
import { DeniedModule } from './denied/denied.module';
import { EnrolledModule } from './enrolled/enrolled.module';

@Module({
  imports: [AssignedModule, DeniedModule, EnrolledModule],
})
export class ReviewModule {}
