import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsInPaymentOptionConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(paymentOptionId: number, _args: ValidationArguments) {
    const option = await this.prisma.school_payment_option.findUnique({
      where: { payment_option_id: paymentOptionId },
    });
    return !!option; // true = valid
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return `Payment option does not exist.`;
  }
}
