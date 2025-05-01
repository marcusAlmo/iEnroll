import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassificationService } from './school-classification.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('SchoolClassificationService', () => {
  let service: SchoolClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      providers: [SchoolClassificationService, ExceptionCheckerService],
    }).compile();

    service = module.get<SchoolClassificationService>(
      SchoolClassificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
