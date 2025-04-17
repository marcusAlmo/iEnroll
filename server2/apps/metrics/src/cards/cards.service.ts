import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AcademicYear } from './interfaces/cards.interface';
import { application_status } from '@prisma/client';
import { EnrollmentStatus } from './enums/enrollment-status.enum';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getEnrollmentTotal(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const academicYear: AcademicYear['returnValue']['data'] =
      await this.getAcademicYear(schoolId);

    if (!academicYear)
      return this.microserviceUtilityService.notFoundExceptionReturn(
        'School not found',
      );

    const enrollmentTotal: MicroserviceUtility['returnValue'] =
      await this.getTotal(EnrollmentStatus.PENDING, schoolId, academicYear);

    return enrollmentTotal;
  }

  public async getAcceptedEnrollmentTotal(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    console.log('schoolId', schoolId);
    const academicYear: MicroserviceUtility['returnValue']['data'] =
      await this.getAcademicYear(schoolId);

    const enrollmentTotal = await this.getTotal(
      EnrollmentStatus.SUCCESSFUL,
      schoolId,
      academicYear,
    );

    return enrollmentTotal;
  }

  public async getInvalidOrDeniedEnrollmentTotal(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const academicYear: MicroserviceUtility['returnValue']['data'] =
      await this.getAcademicYear(schoolId);

    const enrollmentTotal = await this.getTotal(
      EnrollmentStatus.FAILED,
      schoolId,
      academicYear,
    );

    return enrollmentTotal;
  }

  // SUPPORTING METHODS

  private async getAcademicYear(
    schoolId: number,
  ): Promise<AcademicYear['returnValue']['data']> {
    console.log('schoolId2', schoolId);
    const academicYear = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        academic_year: true,
      },
    });

    console.log('academicYear', academicYear);

    if (!academicYear) return null;

    const academicYearSplit = academicYear.academic_year.split('-');

    return {
      start: new Date(academicYearSplit[0]),
      end: new Date(academicYearSplit[1]),
    };
  }

  private async getTotal(
    mode: EnrollmentStatus,
    schoolId: number,
    academicYear: AcademicYear['returnValue']['data'],
  ): Promise<MicroserviceUtility['returnValue']> {
    if (!academicYear)
      return this.microserviceUtilityService.notFoundExceptionReturn(
        'Academic year not found',
      );

    const baseCondition: any = {
      school_id: schoolId,
      student_student_student_idTouser: {
        enrollment_application: {
          application_datetime: {
            gte: academicYear.start,
            lte: academicYear.end,
          },
        },
      },
    };

    if (mode == EnrollmentStatus.SUCCESSFUL)
      baseCondition.status = application_status.accepted;
    else if (mode == EnrollmentStatus.FAILED)
      baseCondition.status = {
        in: [application_status.invalid, application_status.denied],
      };

    const enrollmentTotal = await this.prisma.user.count({
      where: baseCondition,
    });

    return this.microserviceUtilityService.returnSuccess({
      enrollment_total: enrollmentTotal,
    });
  }
}
