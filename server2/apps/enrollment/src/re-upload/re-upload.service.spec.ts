import { Test, TestingModule } from '@nestjs/testing';
import { ReUploadService } from './re-upload.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';

describe('ReUploadService', () => {
  let service: ReUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReUploadService, PrismaService],
    }).compile();

    service = module.get<ReUploadService>(ReUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
