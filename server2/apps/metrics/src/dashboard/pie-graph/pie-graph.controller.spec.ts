import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphController } from './pie-graph.controller';
import { PieGraphService } from './pie-graph.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { CardsService } from '../cards/cards.service';

describe('PieGraphController', () => {
  let controller: PieGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PieGraphController],
      providers: [
        PieGraphService,
        PrismaService,
        MicroserviceUtilityService,
        CardsService,
      ],
    }).compile();

    controller = module.get<PieGraphController>(PieGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
