import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('EnrollmentTrendDataController', () => {
  let controller: EnrollmentTrendDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.METRICS])],
      controllers: [EnrollmentTrendDataController],
      providers: [EnrollmentTrendDataService, ExceptionCheckerService],
    }).compile();

    controller = module.get<EnrollmentTrendDataController>(
      EnrollmentTrendDataController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
