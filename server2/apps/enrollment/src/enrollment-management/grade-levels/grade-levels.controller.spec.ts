import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsController } from './grade-levels.controller';
import { GradeLevelsService } from './grade-levels.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('GradeLevelsController', () => {
  let controller: GradeLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeLevelsController],
      providers: [
        GradeLevelsService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    controller = module.get<GradeLevelsController>(GradeLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
