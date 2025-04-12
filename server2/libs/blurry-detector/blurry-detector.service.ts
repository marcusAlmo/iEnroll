import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class BlurryDetectorService {
  private readonly threshold: number;

  constructor() {
    this.threshold = 150;
  }

  private async computeLaplacianVariance(
    image: string | Buffer,
  ): Promise<number> {
    const laplacianKernel = {
      width: 3,
      height: 3,
      kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    };

    const resizedBuffer = await sharp(image)
      .resize(500)
      .flatten({ background: '#ffffff' })
      .greyscale()
      .raw()
      .convolve(laplacianKernel)
      .toBuffer();

    const mean =
      resizedBuffer.reduce((sum, val) => sum + val, 0) / resizedBuffer.length;

    const variance =
      resizedBuffer.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      resizedBuffer.length;

    return variance;
  }

  async isImageBlurry(image: string | Buffer): Promise<boolean> {
    const variance = await this.computeLaplacianVariance(image);
    console.log(`Laplacian Variance: ${variance}`);
    return variance < this.threshold;
  }
}
