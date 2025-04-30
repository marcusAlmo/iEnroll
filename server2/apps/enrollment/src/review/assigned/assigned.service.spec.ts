import { Test, TestingModule } from '@nestjs/testing';
import { AssignedService } from './assigned.service';

describe('AssignedService', () => {
  let service: AssignedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedService],
    }).compile();

    service = module.get<AssignedService>(AssignedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
