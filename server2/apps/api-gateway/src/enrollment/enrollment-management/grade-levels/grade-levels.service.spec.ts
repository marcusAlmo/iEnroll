import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsService } from './grade-levels.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('GradeLevelsService', () => {
  let service: GradeLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      providers: [GradeLevelsService, ExceptionCheckerService],
    }).compile();

    service = module.get<GradeLevelsService>(GradeLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
