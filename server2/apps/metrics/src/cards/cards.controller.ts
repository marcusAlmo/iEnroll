import { Controller } from '@nestjs/common';
import { CardsService } from './cards.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @MessagePattern({ cmd: 'enrollment-total' })
  async getEnrollmentTotal(payload: { schoolId: number }) {
    return await this.cardsService.getEnrollmentTotal(payload.schoolId);
  }

  @MessagePattern({ cmd: 'accepted-enrollment-total' })
  async getAcceptedEnrollmentTotal(payload: { schoolId: number }) {
    return await this.cardsService.getAcceptedEnrollmentTotal(payload.schoolId);
  }

  @MessagePattern({ cmd: 'invalid-or-denied-enrollment-total' })
  async getInvalidOrDeniedEnrollmentTotal(payload: { schoolId: number }) {
    return await this.cardsService.getInvalidOrDeniedEnrollmentTotal(
      payload.schoolId,
    );
  }
}
