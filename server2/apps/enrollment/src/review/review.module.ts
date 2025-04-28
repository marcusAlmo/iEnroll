import { Module } from '@nestjs/common';
import { AssignedModule } from './assigned/assigned.module';

@Module({
  imports: [AssignedModule],
})
export class ReviewModule {}
