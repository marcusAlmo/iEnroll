import { Test, TestingModule } from '@nestjs/testing';
import { DateTimeUtilityService } from './date-time-utility.service';

describe('DateTimeUtilityService', () => {
  let service: DateTimeUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateTimeUtilityService],
    }).compile();

    service = module.get<DateTimeUtilityService>(DateTimeUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
