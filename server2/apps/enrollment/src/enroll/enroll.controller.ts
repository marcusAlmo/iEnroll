import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EnrollService } from './enroll.service';

@Controller('enroll')
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @MessagePattern({ cmd: 'get_sch_and_schedule_selection' })
  async getSchoolLevelAndScheduleSelection(payload: { id: number }) {
    return await this.enrollService.getSchoolLevelAndScheduleSelection(
      payload.id,
    );
  }

  @MessagePattern({ cmd: 'get_all_section_type_requirements' })
  async getAllGradeSectionTypeRequirements(payload: { id: number }) {
    return await this.enrollService.getAllGradeSectionTypeRequirements(
      payload.id,
    );
  }

  @MessagePattern({ cmd: 'get_payment_method_details' })
  async getPaymentMethodDetails(payload: { id: number }) {
    return await this.enrollService.getPaymentMethodDetails(payload.id);
  }

  @MessagePattern({ cmd: 'submit_payment' })
  async submitPayment(payload: {
    fileId: number;
    paymentOptionId: number;
    studentId: number;
  }) {
    return await this.enrollService.submitPayment(payload);
  }

  @MessagePattern({ cmd: 'submit_requirements' })
  async submitRequirements(payload: any) {
    return await this.enrollService.submitRequirements(payload);
  }
}
