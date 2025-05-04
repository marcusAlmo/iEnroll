import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityService } from './plan-capacity.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('PlanCapacityService', () => {
  let service: PlanCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanCapacityService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    service = module.get<PlanCapacityService>(PlanCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
