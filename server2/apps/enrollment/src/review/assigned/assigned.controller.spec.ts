import { Test, TestingModule } from '@nestjs/testing';
import { AssignedController } from './assigned.controller';
import { AssignedService } from './assigned.service';

describe('AssignedController', () => {
  let controller: AssignedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignedController],
      providers: [AssignedService],
    }).compile();

    controller = module.get<AssignedController>(AssignedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
