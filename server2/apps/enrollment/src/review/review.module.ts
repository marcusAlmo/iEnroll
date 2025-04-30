import { Module } from '@nestjs/common';
import { AssignedModule } from './assigned/assigned.module';
import { DeniedModule } from './denied/denied.module';

@Module({
  imports: [AssignedModule, DeniedModule],
})
export class ReviewModule {}
