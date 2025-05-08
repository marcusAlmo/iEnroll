import { Test, TestingModule } from '@nestjs/testing';
import { ReUploadController } from './re-upload.controller';
import { ReUploadService } from './re-upload.service';

describe('ReUploadController', () => {
  let controller: ReUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReUploadController],
      providers: [ReUploadService],
    }).compile();

    controller = module.get<ReUploadController>(ReUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
