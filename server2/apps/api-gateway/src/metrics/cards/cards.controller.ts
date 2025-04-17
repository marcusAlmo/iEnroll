import { Controller, Get /**, UseGuards */ } from '@nestjs/common';
import { CardsService } from './cards.service';
import { User } from '@lib/decorators/user.decorator';
//import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('metrics/cards')
//@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('enrollment-total')
  async getEnrollmentTotal(@User('school_id') schoolId: number) {
    return await this.cardsService.getEnrollmentTotal({ schoolId });
  }

  @Get('successful-enrollment-total')
  async getAcceptedEnrollmentTotal(@User('school_id') schoolId: number) {
    schoolId = 3;
    return await this.cardsService.getAcceptedEnrollmentTotal({ schoolId });
  }

  @Get('failed-enrollment-total')
  async getInvalidOrDeniedEnrollmentTotal(@User('school_id') schoolId: number) {
    return await this.cardsService.getInvalidOrDeniedEnrollmentTotal({
      schoolId,
    });
  }
}
