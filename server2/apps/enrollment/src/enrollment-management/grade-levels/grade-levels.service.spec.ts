import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsService } from './grade-levels.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('GradeLevelsService', () => {
  let service: GradeLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeLevelsService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    service = module.get<GradeLevelsService>(GradeLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
