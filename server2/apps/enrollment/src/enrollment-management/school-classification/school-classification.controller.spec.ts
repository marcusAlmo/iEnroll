import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassificationController } from './school-classification.controller';
import { SchoolDetailsService } from '../school-details/school-details.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { SchoolClassificationService } from './school-classification.service';

describe('SchoolClassificationController', () => {
  let controller: SchoolClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolClassificationController],
      providers: [
        SchoolDetailsService,
        PrismaService,
        MicroserviceUtilityService,
        SchoolClassificationService,
      ],
    }).compile();

    controller = module.get<SchoolClassificationController>(
      SchoolClassificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
