import { Test, TestingModule } from '@nestjs/testing';
import { DeniedController } from './denied.controller';
import { DeniedService } from './denied.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('DeniedController', () => {
  let controller: DeniedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeniedController],
      providers: [DeniedService, PrismaService],
    }).compile();

    controller = module.get<DeniedController>(DeniedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
