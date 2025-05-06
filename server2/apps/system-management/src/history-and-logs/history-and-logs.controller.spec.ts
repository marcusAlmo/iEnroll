import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAndLogsController } from './history-and-logs.controller';

describe('HistoryAndLogsController', () => {
  let controller: HistoryAndLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryAndLogsController],
    }).compile();

    controller = module.get<HistoryAndLogsController>(HistoryAndLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
