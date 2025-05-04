import { Test, TestingModule } from '@nestjs/testing';
import { AssignedService } from './assigned.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

describe('AssignedService', () => {
  let service: AssignedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedService, PrismaService, FileCommonService],
    }).compile();

    service = module.get<AssignedService>(AssignedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
