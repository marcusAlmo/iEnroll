import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('EnrollmentTrendDataService', () => {
  let service: EnrollmentTrendDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentTrendDataService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    service = module.get<EnrollmentTrendDataService>(
      EnrollmentTrendDataService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
