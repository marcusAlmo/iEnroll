import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  SelectionReturn,
  RequirementsReturn,
  PaymentMethodsReturn,
  SubmitPaymentsReturn,
  SubmitRequirementsReturn,
  ValidatePaymentOptionReturn,
  CheckStudentAlreadyPaidReturn,
  CheckRequirementIdsValidReturn,
  AcademicLevelsReturn,
  GradeLevelsReturn,
  SchedulesReturn,
  GradeSectionTypesReturn,
  SectionsReturn,
  MakeStudentEnrollmentReturn,
  MakeStudentEnrollmentPayload,
} from './enroll.types';
import { FileService } from '../../file/file.service';
import {
  RequirementTextDto,
  RequirementDocumentDto,
} from '@lib/dtos/src/enrollment/v1/enroll.dto';
import { EnrollService as EnrollService2 } from 'apps/enrollment/src/enroll/enroll.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class EnrollService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly documentService: FileService,
    // private readonly prisma: PrismaService,
  ) {}

  private formatFileName(studentId: number) {
    const currentYear = new Date().getFullYear();
    return `${studentId}_requirements_${currentYear}_${currentYear + 1}`;
  }

  private setFileName(file: Express.Multer.File, studentId: number) {
    return {
      ...file,
      filename: this.formatFileName(studentId),
    } as Express.Multer.File;
  }

  async getSchoolLevelAndScheduleSelection(payload: { id: number }) {
    const result: SelectionReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_sch_and_schedule_selection',
        },
        payload,
      ),
    );

    return result;
  }

  async getAcademicLevelsBySchool(payload: { schoolId: number }) {
    const result: AcademicLevelsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_academic_levels_by_school',
        },
        payload,
      ),
    );

    return result;
  }

  async getGradeLevelsByAcademicLevel(payload: { academicLevelCode: string }) {
    const result: GradeLevelsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_grade_levels_by_academic_level',
        },
        payload,
      ),
    );

    return result;
  }

  async getSchedulesByGradeLevel(payload: { gradeLevelCode: string }) {
    const result: SchedulesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_schedules_by_grade_level',
        },
        payload,
      ),
    );

    return result;
  }

  async getGradeSectionTypesByGradeLevel(payload: { gradeLevelCode: string }) {
    const result: GradeSectionTypesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_grade_section_types_by_grade_level',
        },
        payload,
      ),
    );

    return result;
  }

  async getSectionsByGradeLevel(payload: { gradeLevelCode: string }) {
    const result: SectionsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_sections_by_grade_level',
        },
        payload,
      ),
    );

    return result;
  }

  async getAllGradeSectionTypeRequirements(payload: { id: number }) {
    const result: RequirementsReturn = await lastValueFrom(
      this.client.send({ cmd: 'get_all_section_type_requirements' }, payload),
    );

    return result;
  }

  async getPaymentMethodDetails(payload: { id: number }) {
    const result: PaymentMethodsReturn = await lastValueFrom(
      this.client.send({ cmd: 'get_payment_method_details' }, payload),
    );

    return result;
  }

  async submitPayment(payload: {
    file: Express.Multer.File;
    paymentOptionId: number;
    studentId: number;
    schoolId: number;
  }) {
    const isPaymentOptionIdExists: ValidatePaymentOptionReturn =
      await lastValueFrom(
        this.client.send(
          {
            cmd: 'validate_payment_option_id',
          },
          { paymentOptionId: payload.paymentOptionId },
        ),
      );

    if (!isPaymentOptionIdExists) {
      throw new NotFoundException('Payment option id does not exist.');
    }

    const isStudentAlreadyPaid: CheckStudentAlreadyPaidReturn =
      await lastValueFrom(
        this.client.send(
          {
            cmd: 'check_if_student_is_paid',
          },
          { studentId: payload.studentId },
        ),
      );

    if (isStudentAlreadyPaid) {
      throw new BadRequestException('Student already paid.');
    }

    const file = this.setFileName(payload.file, payload.studentId);

    const { document, success } = await this.documentService.uploadFile(
      file,
      payload.schoolId,
    );

    if (!success)
      throw new InternalServerErrorException(
        'An error occured in uploading file',
      );

    if (!document)
      throw new InternalServerErrorException('Returned file is undefined.');

    const submitPayload = {
      fileId: document.id,
      paymentOptionId: payload.paymentOptionId,
      studentId: payload.studentId,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result: SubmitPaymentsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'submit_payment',
        },
        submitPayload,
      ),
    );

    return { success: true };
  }

  async checkIfAllRequirementIdsAreValid(requirementIds: number[]) {
    const result: CheckRequirementIdsValidReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'check_if_all_requirements_are_valid',
        },
        { requirementIds },
      ),
    );

    return result;
  }

  private async sendRequirementToService(
    data: Parameters<EnrollService2['submitRequirements']>[0],
  ): Promise<SubmitRequirementsReturn> {
    return await lastValueFrom(
      this.client.send({ cmd: 'submit_requirements' }, data),
    );
  }

  async submitRequirements(input: {
    payloads: (RequirementTextDto | RequirementDocumentDto)[];
    studentId: number;
    schoolId: number;
  }): Promise<{
    success: boolean;
    failedItems: { requirementId: number; reason: string }[];
  }> {
    const { payloads, studentId } = input;

    const tasks = payloads.map(async (item) => {
      try {
        if (item.type === 'document') {
          const file = this.setFileName(item.value, studentId);
          const { document, success } = await this.documentService.uploadFile(
            file,
            1,
          );

          if (!success)
            throw new InternalServerErrorException(
              'An error occured in uploading file',
            );
          if (!document) throw new Error('Uploaded document is undefined.');

          const type: $Enums.attachment_type = document.type.includes('image')
            ? $Enums.attachment_type.image
            : $Enums.attachment_type.document;

          return {
            applicationId: studentId,
            requirementId: item.requirementId,
            textContent: document.url,
            type,
            fileId: document.id,
          };
        } else {
          return {
            applicationId: studentId,
            requirementId: item.requirementId,
            textContent: item.value,
            type: $Enums.attachment_type.document,
          };
        }
      } catch (err: any) {
        return {
          error: true,
          requirementId: item.requirementId,
          reason: err.message ?? 'Unknown error',
        };
      }
    });

    const resolved = await Promise.all(tasks);

    const successfulPayloads = resolved.filter(
      (
        item,
      ): item is Exclude<
        (typeof resolved)[number],
        { error: boolean; reason: string }
      > => !('error' in item && 'reason' in item),
    );

    const failedItems = resolved
      .filter(
        (
          item,
        ): item is { error: boolean; requirementId: number; reason: string } =>
          'error' in item && item.error === true,
      )
      .map(({ requirementId, reason }) => ({ requirementId, reason }));

    if (successfulPayloads.length > 0) {
      await this.sendRequirementToService(successfulPayloads);
    }

    return {
      success: failedItems.length === 0,
      failedItems,
    };
  }

  async uploadFile(
    file: Express.Multer.File,
    studentId: number,
    schoolId: number,
  ) {
    const modifiedFile = this.setFileName(file, studentId);
    return await this.documentService.uploadFile(modifiedFile, schoolId);
  }

  async makeStudentEnrollmentApplication(
    payload: MakeStudentEnrollmentPayload,
  ) {
    const result: MakeStudentEnrollmentReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'make_student_enrollment_application',
        },
        payload,
      ),
    );

    return result;
  }
}
