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
} from './enroll.types';
import { DocumentService } from '../../document/document.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
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
    private readonly documentService: DocumentService,
    private readonly prisma: PrismaService,
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
  }) {
    const isPaymentOptionIdExists = Boolean(
      await this.prisma.school_payment_option.findFirst({
        select: { payment_option_id: true },
        where: { payment_option_id: payload.paymentOptionId },
      }),
    );

    if (!isPaymentOptionIdExists) {
      throw new NotFoundException('Payment option id does not exist.');
    }

    const isStudentAlreadyPaid = Boolean(
      await this.prisma.enrollment_fee_payment.findFirst({
        where: {
          student_id: payload.studentId,
        },
      }),
    );

    if (isStudentAlreadyPaid) {
      throw new BadRequestException('Student already paid.');
    }

    const file = this.setFileName(payload.file, payload.studentId);

    const { document, error } = await this.documentService.uploadFile(file);

    if (error)
      throw new InternalServerErrorException(
        'An error occured in uploading file. Error: ' + error?.message,
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

  async checkIfAllRequirementIdsAreValid(
    requirementIds: number[],
  ): Promise<boolean> {
    const found = await this.prisma.enrollment_requirement.findMany({
      where: {
        requirement_id: {
          in: requirementIds,
        },
      },
      select: {
        requirement_id: true,
      },
    });

    const foundIds = new Set(found.map((req) => req.requirement_id));
    return requirementIds.every((id) => foundIds.has(id));
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
  }): Promise<{
    success: boolean;
    failedItems: { requirementId: number; reason: string }[];
  }> {
    const { payloads, studentId } = input;

    const tasks = payloads.map(async (item) => {
      try {
        if (item.type === 'document') {
          const file = this.setFileName(item.value, studentId);
          const { document, error } =
            await this.documentService.uploadFile(file);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (error) throw new Error(error.message);
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
}
