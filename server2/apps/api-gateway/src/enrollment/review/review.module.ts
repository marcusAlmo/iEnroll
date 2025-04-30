import { Module } from '@nestjs/common';
import { AssignedModule } from './assigned/assigned.module';
import { RouterModule } from '@nestjs/core';
import { mapModulesToBasePath } from '@lib/utils/router.utils';
import { DeniedModule } from './denied/denied.module';

@Module({
  imports: [
    AssignedModule,
    RouterModule.register(
      mapModulesToBasePath('enrollment/review', [AssignedModule]),
    ),
    DeniedModule,
  ],
})
export class ReviewModule {}
