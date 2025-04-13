import { Test, TestingModule } from '@nestjs/testing';
import { SecureUtilityService } from './secure-utility.service';

describe('SecureUtilityService', () => {
  let service: SecureUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecureUtilityService],
    }).compile();

    service = module.get<SecureUtilityService>(SecureUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
