import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphService } from './pie-graph.service';

describe('PieGraphService', () => {
  let service: PieGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PieGraphService],
    }).compile();

    service = module.get<PieGraphService>(PieGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
