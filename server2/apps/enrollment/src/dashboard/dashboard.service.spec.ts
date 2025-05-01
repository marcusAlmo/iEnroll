import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, PrismaService, FileCommonService],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
