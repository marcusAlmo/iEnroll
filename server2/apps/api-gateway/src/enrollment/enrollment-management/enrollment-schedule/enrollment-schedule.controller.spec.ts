import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentScheduleController } from './enrollment-schedule.controller';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('EnrollmentScheduleController', () => {
  let controller: EnrollmentScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [EnrollmentScheduleController],
      providers: [EnrollmentScheduleService, ExceptionCheckerService],
    }).compile();

    controller = module.get<EnrollmentScheduleController>(
      EnrollmentScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
