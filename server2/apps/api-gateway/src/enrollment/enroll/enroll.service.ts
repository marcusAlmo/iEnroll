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

@Injectable()
export class EnrollService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly documentService: DocumentService,
    private readonly prisma: PrismaService,
  ) {}

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

    const { document, error } = await this.documentService.uploadFile(
      payload.file,
    );

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

  async submitRequirements(payload: any) {
    const result: SubmitRequirementsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'submit_requirements',
        },
        payload,
      ),
    );
    return result;
  }
}
