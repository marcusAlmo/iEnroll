import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceUtilityService } from './microservice-utility.service';

describe('MicroserviceUtilityService', () => {
  let service: MicroserviceUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroserviceUtilityService],
    }).compile();

    service = module.get<MicroserviceUtilityService>(MicroserviceUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
