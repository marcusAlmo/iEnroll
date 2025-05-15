import { Controller } from '@nestjs/common';
import { FeesService } from './fees.service';
import { MessagePattern } from '@nestjs/microservices';
import { Fees } from './interface/fees.interface';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @MessagePattern({ cmd: 'get-grade-levels-and-fees' })
  async getGradeLevelsAndFees(payload: { schoolId: number }) {
    return await this.feesService.gettGradeLevelsAndFees(payload.schoolId);
  }

  @MessagePattern({ cmd: 'save-fees' })
  async saveFees(payload: {
    schoolId: number;
    receivedData: Fees['receivedData'];
  }) {
    return await this.feesService.saveFees(
      payload.schoolId,
      payload.receivedData,
    );
  }

  @MessagePattern({ cmd: 'get-fee-types' })
  async getFeeTypes() {
    return await this.feesService.retrieveFeeTypes();
  }

  @MessagePattern({ cmd: 'get-grade-levels' })
  async getGradeLevels(payload: { schoolId: number }) {
    return await this.feesService.getGradeLevels(payload.schoolId);
  }

  @MessagePattern({ cmd: 'delete-fee' })
  async deleteFee(payload: { feeId: number }) {
    return await this.feesService.deleteFee(payload.feeId);
  }
}
