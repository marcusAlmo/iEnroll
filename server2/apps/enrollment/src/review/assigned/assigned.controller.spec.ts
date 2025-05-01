import { Test, TestingModule } from '@nestjs/testing';
import { AssignedController } from './assigned.controller';
import { AssignedService } from './assigned.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

describe('AssignedController', () => {
  let controller: AssignedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignedController],
      providers: [AssignedService, PrismaService, FileCommonService],
    }).compile();

    controller = module.get<AssignedController>(AssignedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
