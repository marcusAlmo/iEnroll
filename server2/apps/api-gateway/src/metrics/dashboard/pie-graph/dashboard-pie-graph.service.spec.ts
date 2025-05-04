import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphService } from './pie-graph.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('DashboardPieGraphService', () => {
  let service: PieGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      providers: [PieGraphService, ExceptionCheckerService],
    }).compile();

    service = module.get<PieGraphService>(PieGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
