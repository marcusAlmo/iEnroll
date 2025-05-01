import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('EnrollmentTrendDataService', () => {
  let service: EnrollmentTrendDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      providers: [EnrollmentTrendDataService, ExceptionCheckerService],
    }).compile();

    service = module.get<EnrollmentTrendDataService>(
      EnrollmentTrendDataService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
