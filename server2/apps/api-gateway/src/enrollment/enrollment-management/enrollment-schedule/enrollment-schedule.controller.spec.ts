import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentScheduleController } from './enrollment-schedule.controller';

describe('EnrollmentScheduleController', () => {
  let controller: EnrollmentScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentScheduleController],
    }).compile();

    controller = module.get<EnrollmentScheduleController>(EnrollmentScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
