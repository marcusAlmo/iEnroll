import { Test, TestingModule } from '@nestjs/testing';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('EnrollController', () => {
  let controller: EnrollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollController],
      providers: [EnrollService, PrismaService],
    }).compile();

    controller = module.get<EnrollController>(EnrollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
