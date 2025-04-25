import { User } from '@lib/decorators/user.decorator';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { FeesService } from './fees.service';
import { Fees } from './dto/fees.dto';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('retrieve')
  public async gettGradeLevelsAndFees(@User('school_id') schoolId: number) {
    schoolId = 0;
    return await this.feesService.gettGradeLevelsAndFees({ schoolId });
  }

  @Post('save')
  public async saveFees(
    @User('school_id') schoolId: number,
    @Body() receivedData: Fees,
  ) {
    schoolId = 0;
    return await this.feesService.saveFees(schoolId, receivedData);
  }
}
