import { Controller } from '@nestjs/common';
import { ImageService } from './image.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @MessagePattern({ cmd: 'check_if_blurry' })
  async checkIfBlurry(file: any) {
    return await this.imageService.checkIfBlurry({
      ...file,
      buffer: Buffer.from(file.buffer.data),
    });
  }

  @MessagePattern({ cmd: 'extract_text_from_image' })
  async extractTextFromImage(file: any) {
    return await this.imageService.extractTextFromImage({
      ...file,
      buffer: Buffer.from(file.buffer.data),
    });
  }

  private extractGcashDetails(text: string) {
    const lowerText = text.toLowerCase();

    const isGcash =
      lowerText.includes('gcash') ||
      lowerText.includes('sent via') ||
      lowerText.includes('you have sent php');

    if (!isGcash) return null;

    const amountRegex =
      /(?:amount(?:\s+sent)?|you have sent php)\s*([₱]?\s*[\d,.]+)/i;
    const refRegex = /ref(?:erence)?(?:\s+no\.?)?\s*[:.]?\s*([\d\s]+)/i;
    const dateRegex =
      /(?:on\s*)?(\d{2}-\d{2}-\d{4})\s+(\d{1,2}:\d{2}\s*(?:am|pm))|(\w+\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s*(?:am|pm))/i;
    const balanceRegex = /balance\s+(?:is\s+)?php\s*([\d,.]+)/i;
    const phoneRegex = /(\b09\d{9}\b)/;
    const nameRegex = /to\s+([\w\*]+\s+[\w\*\.]+)/i;

    const amountMatch = text.match(amountRegex);
    const refMatch = text.match(refRegex);
    const dateMatch = text.match(dateRegex);
    const balanceMatch = text.match(balanceRegex);
    const phoneMatch = text.match(phoneRegex);
    const nameMatch = text.match(nameRegex);

    const amount = amountMatch
      ? parseFloat(amountMatch[1].replace(/[₱,\s]/g, ''))
      : undefined;
    const referenceNumber = refMatch
      ? refMatch[1].replace(/\s+/g, '')
      : undefined;

    const dateString = dateMatch
      ? dateMatch[1]
        ? `${dateMatch[1]} ${dateMatch[2]}`
        : dateMatch[3]
      : undefined;
    const date = dateString ? new Date(dateString).toISOString() : undefined;

    return {
      platform: 'Gcash',
      isPaymentMethod: true,
      amount,
      referenceNumber,
      date,
      phoneNumber: phoneMatch?.[1],
      recipient: nameMatch?.[1]?.trim(),
      balance: balanceMatch
        ? parseFloat(balanceMatch[1].replace(/,/g, ''))
        : undefined,
      rawText: text,
    };
  }

  @MessagePattern({ cmd: 'check_if_payment_method' })
  async checkIfPaymentMethod(file: any) {
    const text = (
      await this.imageService.extractTextFromImage({
        ...file,
        buffer: Buffer.from(file.buffer.data),
      })
    ).toLowerCase();

    if (text.includes('gcash') || text.includes('express send')) {
      return this.extractGcashDetails(text);
    }

    if (text.includes('maya')) {
      return {
        platform: 'Maya',
      };
    }

    return {
      platform: 'Undetermined',
    };
  }
}
