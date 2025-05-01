import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphController } from './pie-graph.controller';
import { PieGraphService } from './pie-graph.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('DashboardPieGraphController', () => {
  let controller: PieGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      controllers: [PieGraphController],
      providers: [PieGraphService, ExceptionCheckerService],
    }).compile();

    controller = module.get<PieGraphController>(PieGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
