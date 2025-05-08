import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EnrollService } from './enroll.service';
import { $Enums } from '@prisma/client';
import { EnrollmentApplicationDto } from '../../../../libs/dtos/src/enrollment/v1/microservice/enroll.dto';

@Controller('enroll')
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @MessagePattern({ cmd: 'get_sch_and_schedule_selection' })
  async getSchoolLevelAndScheduleSelection(@Payload() payload: { id: number }) {
    return await this.enrollService.getSchoolLevelAndScheduleSelection(
      payload.id,
    );
  }

  @MessagePattern({ cmd: 'get_academic_levels_by_school' })
  async getAcademicLevelsBySchool(@Payload() payload: { schoolId: number }) {
    return await this.enrollService.getAcademicLevelsBySchool(payload.schoolId);
  }

  @MessagePattern({ cmd: 'get_grade_levels_by_academic_level' })
  async getGradeLevelsByAcademicLevel(
    @Payload() payload: { academicLevelCode: string; schoolId: number },
  ) {
    return await this.enrollService.getGradeLevelsByAcademicLevel(
      payload.academicLevelCode,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'get_schedules_by_grade_level' })
  async getSchedulesByGradeLevel(
    @Payload() payload: { gradeLevelCode: string },
  ) {
    return await this.enrollService.getSchedulesByGradeLevel(
      payload.gradeLevelCode,
    );
  }

  @MessagePattern({ cmd: 'get_grade_section_types_by_grade_level' })
  async getGradeSectionTypesByGradeLevel(
    @Payload() payload: { gradeLevelCode: string },
  ) {
    return await this.enrollService.getGradeSectionTypesByGradeLevel(
      payload.gradeLevelCode,
    );
  }

  @MessagePattern({ cmd: 'get_sections_by_grade_level' })
  async getSectionsByGradeLevel(
    @Payload() payload: { gradeLevelCode: string },
  ) {
    return await this.enrollService.getSectionsByGradeLevel(
      payload.gradeLevelCode,
    );
  }

  @MessagePattern({ cmd: 'get_all_section_type_requirements' })
  async getAllGradeSectionTypeRequirements(@Payload() payload: { id: number }) {
    return await this.enrollService.getAllGradeSectionTypeRequirements(
      payload.id,
    );
  }

  @MessagePattern({ cmd: 'get_payment_method_details' })
  async getPaymentMethodDetails(@Payload() payload: { id: number }) {
    return await this.enrollService.getPaymentMethodDetails(payload.id);
  }

  @MessagePattern({ cmd: 'submit_payment' })
  async submitPayment(
    @Payload()
    payload: {
      fileId: number;
      paymentOptionId: number;
      studentId: number;
    },
  ) {
    return await this.enrollService.submitPayment(payload);
  }

  @MessagePattern({ cmd: 'submit_requirements' })
  async submitRequirements(
    @Payload()
    payload: {
      applicationId: number;
      requirementId: number;
      textContent: string;
      type: $Enums.attachment_type;
      fileId?: number;
    }[],
  ) {
    return await this.enrollService.submitRequirements(payload);
  }

  @MessagePattern({ cmd: 'validate_payment_option_id' })
  async validatePaymentOptionId(
    @Payload() { paymentOptionId }: { paymentOptionId: number },
  ) {
    return await this.enrollService.validatePaymentOptionId({
      paymentOptionId,
    });
  }

  @MessagePattern({ cmd: 'check_if_student_is_paid' })
  async checkIfStudentIsALreadyPaid(
    @Payload() { studentId }: { studentId: number },
  ) {
    return await this.enrollService.checkIfStudentIsALreadyPaid({
      studentId,
    });
  }

  @MessagePattern({ cmd: 'check_if_all_requirements_are_valid' })
  async checkIfAllRequirementIdsAreValid(
    @Payload() { requirementIds }: { requirementIds: number[] },
  ) {
    return await this.enrollService.checkIfAllRequirementIdsAreValid({
      requirementIds,
    });
  }

  @MessagePattern({ cmd: 'make_student_enrollment_application' })
  async makeStudentEnrollmentApplication(
    @Payload(new ValidationPipe({ transform: true, whitelist: true }))
    payload: EnrollmentApplicationDto,
  ) {
    return await this.enrollService.makeStudentEnrollmentApplication(payload);
  }
}
