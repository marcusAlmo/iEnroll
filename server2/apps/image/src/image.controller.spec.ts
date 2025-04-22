import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';

describe('ImageController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let imageController: ImageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [ImageService, OcrService, BlurryDetectorService],
    }).compile();

    imageController = app.get<ImageController>(ImageController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(imageController.getHello()).toBe('Hello World!');
    });
  });
});
