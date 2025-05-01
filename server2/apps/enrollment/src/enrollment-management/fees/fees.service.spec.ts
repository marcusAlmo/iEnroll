import { Test, TestingModule } from '@nestjs/testing';
import { FeesService } from './fees.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('FeesService', () => {
  let service: FeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeesService, PrismaService, MicroserviceUtilityService],
    }).compile();

    service = module.get<FeesService>(FeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
