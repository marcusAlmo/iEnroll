import { Test, TestingModule } from '@nestjs/testing';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('FeesController', () => {
  let controller: FeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [FeesController],
      providers: [FeesService, ExceptionCheckerService],
    }).compile();

    controller = module.get<FeesController>(FeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
