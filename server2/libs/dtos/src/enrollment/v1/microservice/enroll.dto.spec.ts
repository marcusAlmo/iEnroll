import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EnrollmentApplicationDto } from './enroll.dto';
import { ClassConstructor } from 'class-transformer';

describe('EnrollmentApplicationDto', () => {
  it('should validate a correct payload', async () => {
    const payload = {
      details: {
        studentId: 1,
        schoolId: 2,
        gradeLevelCode: 'G10',
        scheduleId: 4,
        remarks: 'Transferee',
      },
      requirements: [
        {
          requirementId: 1,
          attachmentType: 'text',
          textContent: 'I am a transferee',
        },
        {
          requirementId: 2,
          attachmentType: 'document',
          fileId: 123,
        },
      ],
      payment: {
        fileId: 55,
        paymentOptionId: 3,
      },
    };
    const dtoInstance = plainToInstance(
      EnrollmentApplicationDto as ClassConstructor<EnrollmentApplicationDto>,
      payload,
    );
    const errors = await validate(dtoInstance as object);

    expect(errors.length).toBe(0);
  });

  it('should fail if text requirement is missing textContent', async () => {
    const payload = {
      details: {
        studentId: 1,
        schoolId: 2,
        gradeLevelCode: 'G10',
        scheduleId: 4,
      },
      requirements: [
        {
          requirementId: 1,
          attachmentType: 'text',
        },
      ],
      payment: {
        fileId: 55,
        paymentOptionId: 3,
      },
    };

    const dtoInstance = plainToInstance(
      EnrollmentApplicationDto as ClassConstructor<EnrollmentApplicationDto>,
      payload,
    );
    const errors = await validate(dtoInstance as object);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].children?.[0].constraints).toHaveProperty('isString');
  });

  it('should fail if file requirement is missing fileId', async () => {
    const payload = {
      details: {
        studentId: 1,
        schoolId: 2,
        gradeLevelCode: 'G10',
        scheduleId: 4,
      },
      requirements: [
        {
          requirementId: 2,
          attachmentType: 'document',
        },
      ],
      payment: {
        fileId: 55,
        paymentOptionId: 3,
      },
    };

    const dtoInstance = plainToInstance(EnrollmentApplicationDto, payload);
    const errors = await validate(dtoInstance);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].children?.[0].constraints).toHaveProperty('isNumber');
  });
});
