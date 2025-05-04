import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassificationController } from './school-classification.controller';
import { SchoolClassificationService } from './school-classification.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('SchoolClassificationController', () => {
  let controller: SchoolClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [SchoolClassificationController],
      providers: [SchoolClassificationService, ExceptionCheckerService],
    }).compile();

    controller = module.get<SchoolClassificationController>(
      SchoolClassificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
