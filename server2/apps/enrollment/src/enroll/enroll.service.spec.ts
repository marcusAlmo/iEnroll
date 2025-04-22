import { Test, TestingModule } from '@nestjs/testing';
import { EnrollService } from './enroll.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('EnrollService', () => {
  let service: EnrollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollService, PrismaService],
    }).compile();

    service = module.get<EnrollService>(EnrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
