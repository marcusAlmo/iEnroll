import { Test, TestingModule } from '@nestjs/testing';
import { SchoolDetailsController } from './school-details.controller';

describe('SchoolDetailsController', () => {
  let controller: SchoolDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolDetailsController],
    }).compile();

    controller = module.get<SchoolDetailsController>(SchoolDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
