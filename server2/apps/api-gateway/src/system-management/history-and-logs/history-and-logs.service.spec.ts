import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAndLogsService } from './history-and-logs.service';

describe('HistoryAndLogsService', () => {
  let service: HistoryAndLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAndLogsService],
    }).compile();

    service = module.get<HistoryAndLogsService>(HistoryAndLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
