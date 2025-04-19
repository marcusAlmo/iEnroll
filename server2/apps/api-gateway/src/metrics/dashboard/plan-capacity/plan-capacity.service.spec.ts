import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityService } from './plan-capacity.service';

describe('PlanCapacityService', () => {
  let service: PlanCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanCapacityService],
    }).compile();

    service = module.get<PlanCapacityService>(PlanCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
