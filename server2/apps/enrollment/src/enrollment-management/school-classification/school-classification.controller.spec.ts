import { Test, TestingModule } from '@nestjs/testing';
import { SchoolClassificationController } from './school-classification.controller';

describe('SchoolClassificationController', () => {
  let controller: SchoolClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolClassificationController],
    }).compile();

    controller = module.get<SchoolClassificationController>(SchoolClassificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
