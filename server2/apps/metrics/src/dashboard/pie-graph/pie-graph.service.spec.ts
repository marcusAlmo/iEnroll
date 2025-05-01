import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphService } from './pie-graph.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { CardsService } from '../cards/cards.service';

describe('PieGraphService', () => {
  let service: PieGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PieGraphService,
        PrismaService,
        MicroserviceUtilityService,
        CardsService,
      ],
    }).compile();

    service = module.get<PieGraphService>(PieGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
