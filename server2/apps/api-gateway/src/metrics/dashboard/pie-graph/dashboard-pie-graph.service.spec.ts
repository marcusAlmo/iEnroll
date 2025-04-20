import { Test, TestingModule } from '@nestjs/testing';
import { DashboardPieGraphService } from './pie-graph.service';

describe('DashboardPieGraphService', () => {
  let service: DashboardPieGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardPieGraphService],
    }).compile();

    service = module.get<DashboardPieGraphService>(DashboardPieGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
