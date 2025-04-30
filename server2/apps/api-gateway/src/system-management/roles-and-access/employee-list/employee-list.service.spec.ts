import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeListService } from './employee-list.service';

describe('EmployeeListService', () => {
  let service: EmployeeListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeListService],
    }).compile();

    service = module.get<EmployeeListService>(EmployeeListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
