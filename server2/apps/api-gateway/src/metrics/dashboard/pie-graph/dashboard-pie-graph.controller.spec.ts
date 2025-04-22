import { Test, TestingModule } from '@nestjs/testing';
import { DashboardPieGraphController } from './pie-graph.controller';

describe('DashboardPieGraphController', () => {
  let controller: DashboardPieGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardPieGraphController],
    }).compile();

    controller = module.get<DashboardPieGraphController>(DashboardPieGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
