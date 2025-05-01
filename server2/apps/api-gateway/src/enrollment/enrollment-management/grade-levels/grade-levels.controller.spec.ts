import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsController } from './grade-levels.controller';
import { GradeLevelsService } from './grade-levels.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('GradeLevelsController', () => {
  let controller: GradeLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [GradeLevelsController],
      providers: [GradeLevelsService, ExceptionCheckerService],
    }).compile();

    controller = module.get<GradeLevelsController>(GradeLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
