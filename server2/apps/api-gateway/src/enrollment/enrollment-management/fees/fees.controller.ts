import { User } from '@lib/decorators/user.decorator';
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { FeesService } from './fees.service';
import { Fees } from './dto/fees.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('fees')
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('retrieve')
  public async gettGradeLevelsAndFees(@User('school_id') schoolId: number) {
    return await this.feesService.gettGradeLevelsAndFees({ schoolId });
  }

  @Post('save')
  public async saveFees(
    @User('school_id') schoolId: number,
    @Body() receivedData: Fees,
  ) {
    return await this.feesService.saveFees({ schoolId, receivedData });
  }

  @Delete('delete/:feeId')
  public async deleteFee(@Param('feeId') feeId: number) {
    return await this.feesService.deleteFee({ feeId });
  }

  @Get('grade-levels')
  public async getGradeLevels(@User('school_id') schoolId: number) {
    return await this.feesService.getGradeLevels({ schoolId });
  }

  @Get('fee-types')
  public async getFeeTypes() {
    return await this.feesService.getFeeTypes();
  }
}
