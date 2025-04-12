import { ImageController } from 'apps/image/src/image.controller';

export type CheckIfBlurryReturn = Awaited<
  ReturnType<ImageController['checkIfBlurry']>
>;
export type ExtractTextFromImageReturn = Awaited<
  ReturnType<ImageController['extractTextFromImage']>
>;
export type CheckIfPaymentMethodReturn = Awaited<
  ReturnType<ImageController['checkIfPaymentMethod']>
>;
