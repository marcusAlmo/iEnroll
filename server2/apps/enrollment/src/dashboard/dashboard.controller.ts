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
        statusCode: 404,
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
          statusCode: 404,
          message: 'ERROR_STUDENT_NOT_FOUND',
        });
      // case EnrollmentStatus.NOT_ENROLLED:
      //   throw new RpcException({
      //     statusCode: 400,
      //     message: 'ERROR_STUDENT_NOT_ENROLLED',
      //   });
      default:
        return result;
    }
  }

  @MessagePattern({ cmd: 'get_documents_for_reupload' })
  async getDocumentsForReupload(@Payload() payload: { studentId: number }) {
    return await this.dashboardService.getDocumentsForReupload(
      payload.studentId,
    );
  }

  @MessagePattern({ cmd: 'get_file_downloadables_by_student' })
  async getFileDownloadablesByStudent(
    @Payload() payload: { studentId: number; userSchoolId: number },
  ) {
    return await this.dashboardService.getFileDownloadablesByStudent(
      payload.studentId,
      payload.userSchoolId,
    );
  }
}
