import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { EnrollmentStatus } from './enums/enrollment-status.enum';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @MessagePattern({ cmd: 'get_enrollment_details' })
  async getEnrollmentDetails(@Payload() payload: { studentId: number }) {
    const result = await this.dashboardService.getEnrollmentDetails(
      payload.studentId,
    );
    if (!result) {
      throw new RpcException({
        message: 'ERROR_STUDENT_NOT_FOUND',
      });
    }
    return result;
  }

  @MessagePattern({ cmd: 'get_enrollment_status' })
  async getEnrollmentStatus(@Payload() payload: { studentId: number }) {
    const result = await this.dashboardService.getEnrollmentStatus(
      payload.studentId,
    );

    switch (result) {
      case EnrollmentStatus.NOT_FOUND:
        throw new RpcException({
          message: 'ERROR_STUDENT_NOT_FOUND',
        });
      case EnrollmentStatus.NOT_ENROLLED:
        throw new RpcException({
          message: 'ERROR_STUDENT_NOT_ENROLLED',
        });
      default:
        return result;
    }
  }
}
