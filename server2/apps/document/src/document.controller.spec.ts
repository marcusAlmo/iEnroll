import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';

describe('DocumentController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let documentController: DocumentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [DocumentService, PrismaService, OcrService, BlurryDetectorService],
    }).compile();

    documentController = app.get<DocumentController>(DocumentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(documentController.getHello()).toBe('Hello World!');
    });
  });
});
