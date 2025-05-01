import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityController } from './plan-capacity.controller';
import { PlanCapacityService } from './plan-capacity.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('PlanCapacityController', () => {
  let controller: PlanCapacityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      controllers: [PlanCapacityController],
      providers: [PlanCapacityService, ExceptionCheckerService],
    }).compile();

    controller = module.get<PlanCapacityController>(PlanCapacityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
