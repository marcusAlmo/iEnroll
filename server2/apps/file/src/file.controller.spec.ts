import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

describe('FileController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let documentController: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        FileService,
        PrismaService,
        OcrService,
        BlurryDetectorService,
        FileCommonService,
      ],
    }).compile();

    documentController = app.get<FileController>(FileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(documentController.getHello()).toBe('Hello World!');
    });
  });
});
