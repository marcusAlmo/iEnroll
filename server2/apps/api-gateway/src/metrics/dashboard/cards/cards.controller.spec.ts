import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';

describe('CardsController', () => {
  let controller: CardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      controllers: [CardsController],
      providers: [CardsService, ExceptionCheckerService],
    }).compile();

    controller = module.get<CardsController>(CardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
