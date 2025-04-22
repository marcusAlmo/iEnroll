import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityController } from './plan-capacity.controller';

describe('PlanCapacityController', () => {
  let controller: PlanCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanCapacityController],
    }).compile();

    controller = module.get<PlanCapacityController>(PlanCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
