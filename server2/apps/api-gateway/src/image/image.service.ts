import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CheckIfBlurryReturn,
  CheckIfPaymentMethodReturn,
  ExtractTextFromImageReturn,
} from './image.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
  constructor(@Inject('IMAGE_SERVICE') private readonly client: ClientProxy) {}

  async checkIfBlurry(file: Express.Multer.File) {
    const result: CheckIfBlurryReturn = await lastValueFrom(
      this.client.send({ cmd: 'check_if_blurry' }, file),
    );

    return result;
  }

  async extractTextFromImage(file: Express.Multer.File) {
    const result: ExtractTextFromImageReturn = await lastValueFrom(
      this.client.send({ cmd: 'extract_text_from_image' }, file),
    );

    return result;
  }

  async checkIfPaymentMethod(file: Express.Multer.File) {
    const result: CheckIfPaymentMethodReturn = await lastValueFrom(
      this.client.send({ cmd: 'check_if_payment_method' }, file),
    );

    return result;
  }
}
