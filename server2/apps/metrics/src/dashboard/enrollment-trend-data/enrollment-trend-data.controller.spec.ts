import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('EnrollmentTrendDataController', () => {
  let controller: EnrollmentTrendDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentTrendDataController],
      providers: [
        EnrollmentTrendDataService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    controller = module.get<EnrollmentTrendDataController>(
      EnrollmentTrendDataController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
