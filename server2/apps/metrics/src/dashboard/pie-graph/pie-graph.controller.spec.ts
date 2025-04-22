import { Test, TestingModule } from '@nestjs/testing';
import { PieGraphController } from './pie-graph.controller';

describe('PieGraphController', () => {
  let controller: PieGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PieGraphController],
    }).compile();

    controller = module.get<PieGraphController>(PieGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
