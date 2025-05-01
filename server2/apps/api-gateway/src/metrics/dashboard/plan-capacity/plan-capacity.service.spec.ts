import { Test, TestingModule } from '@nestjs/testing';
import { PlanCapacityService } from './plan-capacity.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('PlanCapacityService', () => {
  let service: PlanCapacityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      providers: [PlanCapacityService, ExceptionCheckerService],
    }).compile();

    service = module.get<PlanCapacityService>(PlanCapacityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
