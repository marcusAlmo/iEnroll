import { Test, TestingModule } from '@nestjs/testing';
import { SchoolDetailsService } from './school-details.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

describe('SchoolDetailsService', () => {
  let service: SchoolDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolDetailsService,
        PrismaService,
        MicroserviceUtilityService,
      ],
    }).compile();

    service = module.get<SchoolDetailsService>(SchoolDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
