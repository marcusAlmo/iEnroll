import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionCheckerService } from './exception-checker.service';

describe('ExceptionCheckerService', () => {
  let service: ExceptionCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionCheckerService],
    }).compile();

    service = module.get<ExceptionCheckerService>(ExceptionCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
