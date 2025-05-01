import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('EnrollmentScheduleService', () => {
  let service: EnrollmentScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      providers: [EnrollmentScheduleService, ExceptionCheckerService],
    }).compile();

    service = module.get<EnrollmentScheduleService>(EnrollmentScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
