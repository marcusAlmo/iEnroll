import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  SelectionReturn,
  RequirementsReturn,
  PaymentMethodsReturn,
  SubmitPaymentsReturn,
  SubmitRequirementsReturn,
} from './enroll.types';

@Injectable()
export class EnrollService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
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

  async submitPayment(payload: any) {
    const result: SubmitPaymentsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'submit_payment',
        },
        payload,
      ),
    );

    return result;
  }

  async cubmitRequirements(payload: any) {
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
