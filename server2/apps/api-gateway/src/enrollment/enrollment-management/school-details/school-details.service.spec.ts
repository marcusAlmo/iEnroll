import { Test, TestingModule } from '@nestjs/testing';
import { SchoolDetailsService } from './school-details.service';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ClientsModule } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('SchoolDetailsService', () => {
  let service: SchoolDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      providers: [SchoolDetailsService, ExceptionCheckerService],
    }).compile();

    service = module.get<SchoolDetailsService>(SchoolDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
