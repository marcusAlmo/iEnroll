import { Controller } from '@nestjs/common';
import { CardsService } from './cards.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @MessagePattern({ cmd: 'data' })
  async getEnrollmentData(payload: { schoolId: number }) {
    return await this.cardsService.getEnrollmentData(payload.schoolId);
  }
}
