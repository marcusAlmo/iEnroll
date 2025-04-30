import { Module } from '@nestjs/common';
import { AssignedModule } from './assigned/assigned.module';
import { RouterModule } from '@nestjs/core';
import { mapModulesToBasePath } from '@lib/utils/router.utils';

@Module({
  imports: [
    AssignedModule,
    RouterModule.register(
      mapModulesToBasePath('enrollment/review', [AssignedModule]),
    ),
  ],
})
export class ReviewModule {}
