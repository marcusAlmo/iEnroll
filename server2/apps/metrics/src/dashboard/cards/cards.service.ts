import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AcademicYear } from './interfaces/cards.interface';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getEnrollmentData(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const enrollmentTotal = await this.prisma.enrollment_data.findFirst({
      where: { school_acad_year: { school_id: schoolId } },
      select: {
        received_application_count: true,
        approved_application_count: true,
        denied_application_count: true,
      },
    });

    if (!enrollmentTotal)
      return this.microserviceUtilityService.returnSuccess({
        enrollmentTotal: 0,
        successfullEnrollmentTotal: 0,
        invalidOrDeniedEnrollmentTotal: 0,
      });

    return this.microserviceUtilityService.returnSuccess({
      enrollmentTotal: enrollmentTotal.received_application_count,
      successfullEnrollmentTotal: enrollmentTotal.approved_application_count,
      invalidOrDeniedEnrollmentTotal: enrollmentTotal.denied_application_count,
    });
  }

  // SUPPORTING METHODS

  public async getAcademicYear(
    schoolId: number,
  ): Promise<AcademicYear['returnValue']['data']> {
    const academicYear = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        academic_year: true,
      },
    });

    if (!academicYear) return null;

    const academicYearSplit = academicYear.academic_year.split('-');

    return {
      start: new Date(academicYearSplit[0]),
      end: new Date(academicYearSplit[1]),
    };
  }
}
