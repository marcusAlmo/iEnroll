import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from './requirements.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('RequirementsController', () => {
  let controller: RequirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementsController],
      providers: [
        RequirementsService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    controller = module.get<RequirementsController>(RequirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
