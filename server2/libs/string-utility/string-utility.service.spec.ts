import { Test, TestingModule } from '@nestjs/testing';
import { StringUtilityService } from './string-utility.service';

describe('StringUtilityService', () => {
  let service: StringUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StringUtilityService],
    }).compile();

    service = module.get<StringUtilityService>(StringUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
