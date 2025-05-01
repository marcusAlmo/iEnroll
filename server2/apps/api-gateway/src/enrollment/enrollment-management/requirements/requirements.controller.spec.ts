import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from './requirements.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('RequirementsController', () => {
  let controller: RequirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [RequirementsController],
      providers: [RequirementsService, ExceptionCheckerService],
    }).compile();

    controller = module.get<RequirementsController>(RequirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
