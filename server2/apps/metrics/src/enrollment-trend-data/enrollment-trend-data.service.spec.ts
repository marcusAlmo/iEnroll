import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';

describe('EnrollmentTrendDataService', () => {
  let service: EnrollmentTrendDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentTrendDataService],
    }).compile();

    service = module.get<EnrollmentTrendDataService>(EnrollmentTrendDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
