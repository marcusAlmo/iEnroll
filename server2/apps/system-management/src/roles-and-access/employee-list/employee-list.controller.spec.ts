import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeListController } from './employee-list.controller';

describe('EmployeeListController', () => {
  let controller: EmployeeListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeListController],
    }).compile();

    controller = module.get<EmployeeListController>(EmployeeListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
