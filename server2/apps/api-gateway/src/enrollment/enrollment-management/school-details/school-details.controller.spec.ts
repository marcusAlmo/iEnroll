import { Test, TestingModule } from '@nestjs/testing';
import { SchoolDetailsController } from './school-details.controller';
import { SchoolDetailsService } from './school-details.service';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

describe('SchoolDetailsController', () => {
  let controller: SchoolDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
      controllers: [SchoolDetailsController],
      providers: [SchoolDetailsService, ExceptionCheckerService],
    }).compile();

    controller = module.get<SchoolDetailsController>(SchoolDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
