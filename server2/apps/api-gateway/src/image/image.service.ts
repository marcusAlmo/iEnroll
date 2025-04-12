import { BlurryDetectorService } from '@lib/blurry-detector/blurry-detector.service';
import { OcrService } from '@lib/ocr/ocr.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(
    private readonly blurryDetectorService: BlurryDetectorService,
    private readonly ocrService: OcrService,
  ) {}

  async checkIfBlurry(file: Express.Multer.File) {
    return await this.blurryDetectorService.isImageBlurry(file.buffer);
  }

  async extractTextFromImage(file: Express.Multer.File) {
    return await this.ocrService.extractText(file.buffer);
  }
}
