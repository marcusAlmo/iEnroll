import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityController } from './plan-capacity.controller';
import { PlanCapacityService } from './plan-capacity.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('PlanCapacityController', () => {
  let controller: PlanCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanCapacityController],
      providers: [
        PlanCapacityService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    controller = module.get<PlanCapacityController>(PlanCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
