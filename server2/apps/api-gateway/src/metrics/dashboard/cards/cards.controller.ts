import { Controller, Get, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { User } from '@lib/decorators/user.decorator';
//import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('metrics/cards')
//@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('data')
  async getEnrollmentData(@User('school_id') schoolId: number) {
    return await this.cardsService.getEnrollmentData({ schoolId });
  }
}
