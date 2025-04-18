import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';

describe('EnrollmentTrendDataController', () => {
  let controller: EnrollmentTrendDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentTrendDataController],
    }).compile();

    controller = module.get<EnrollmentTrendDataController>(EnrollmentTrendDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
