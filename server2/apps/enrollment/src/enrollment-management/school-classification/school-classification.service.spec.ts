import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassificationService } from './school-classification.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('SchoolClassificationService', () => {
  let service: SchoolClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolClassificationService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    service = module.get<SchoolClassificationService>(
      SchoolClassificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
