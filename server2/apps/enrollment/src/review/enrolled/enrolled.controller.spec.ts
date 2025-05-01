import { Test, TestingModule } from '@nestjs/testing';
import { EnrolledController } from './enrolled.controller';
import { EnrolledService } from './enrolled.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('EnrolledController', () => {
  let controller: EnrolledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrolledController],
      providers: [EnrolledService, PrismaService],
    }).compile();

    controller = module.get<EnrolledController>(EnrolledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
