import { Test, TestingModule } from '@nestjs/testing';
import { SchoolDetailsController } from './school-details.controller';
import { SchoolDetailsService } from './school-details.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('SchoolDetailsController', () => {
  let controller: SchoolDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolDetailsController],
      providers: [
        SchoolDetailsService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    controller = module.get<SchoolDetailsController>(SchoolDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
