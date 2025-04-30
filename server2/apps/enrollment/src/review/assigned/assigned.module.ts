import { Module } from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { AssignedController } from './assigned.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

@Module({
  controllers: [AssignedController],
  providers: [AssignedService, PrismaService, FileCommonService],
})
export class AssignedModule {}
