import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';

// ocr.service.ts
@Injectable()
export class OcrService {
  private worker: Awaited<ReturnType<typeof createWorker>>;

  async onModuleInit() {
    this.worker = await createWorker();
    // console.log(this.worker);

    // await this.worker.loadLanguage('eng');
    // await this.worker.initialize('eng');
    await this.worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });
    await this.worker.setParameters({
      tessedit_char_whitelist:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ₱:.,/-*',
      preserve_interword_spaces: '1',
    });
  }

  // async extractText(buffer: Buffer): Promise<string> {
  //   const {
  //     data: { text },
  //   } = await this.worker.recognize(buffer);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return text;
  // }

  async extractText(buffer: Buffer): Promise<string> {
    const preprocessed = await sharp(buffer)
      .rotate() // auto-orient based on EXIF
      .flatten({ background: '#ffffff' }) // remove alpha if present
      .grayscale() // convert to grayscale
      .median(1) // slight denoise filter
      .normalize() // contrast normalization
      .modulate({ brightness: 1.1 }) // boost contrast/brightness slightly
      .sharpen({
        sigma: 1, // balance sharpness without noise
        m1: 1.5,
        m2: 1,
        x1: 2,
        y2: 6,
      })
      .gamma() // gamma correction
      .resize({
        width: 1200,
        withoutEnlargement: true,
      })
      .toBuffer();

    const {
      data: { text },
    } = await this.worker.recognize(preprocessed);

    return text.trim();
  }

  // async extractText2(buffer: Buffer): Promise<string> {
  //   const preprocessed = await sharp(buffer)
  //     .flatten({ background: '#ffffff' }) // remove alpha channel
  //     .grayscale()
  //     .normalize() // enhance contrast
  //     .threshold(180) // binarize image, tweak value as needed
  //     .resize({ width: 1000, withoutEnlargement: true }) // upscale small images
  //     .toBuffer();

  //   const {
  //     data: { text },
  //   } = await this.worker.recognize(preprocessed);

  //   return text;
  // }

  async onModuleDestroy() {
    await this.worker.terminate();
  }
}
