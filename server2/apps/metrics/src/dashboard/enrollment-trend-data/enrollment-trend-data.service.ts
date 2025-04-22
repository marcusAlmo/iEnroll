import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { EnrollmentTrendData } from './interface/enrollment-trend-data.interface';
import { DateTimeUtilityService } from '@lib/date-time-utility/date-time-utility.service';
@Injectable()
export class EnrollmentTrendDataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getEnrollmentTrendData(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const academicAndGradeLevelsArr: EnrollmentTrendData['gradeLevelInfoArr'] =
      await this.getAcademicYearsAndGradeLevel(schoolId);

    if (academicAndGradeLevelsArr.length == 0)
      return this.microserviceUtilityService.returnSuccess([]);

    const finalData: EnrollmentTrendData['finalOutput'] =
      await this.getEnrollmentRecordCount(academicAndGradeLevelsArr);

    return this.microserviceUtilityService.returnSuccess(finalData);
  }

  // UTILITY FUNCTIONS

  private async getAcademicYearsAndGradeLevel(
    schoolId: number,
  ): Promise<EnrollmentTrendData['gradeLevelInfoArr']> {
    const gradeLevels = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
      },
      select: {
        grade_level_offered_id: true,
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    if (!gradeLevels || gradeLevels.length === 0) return [];

    const academicAndGradeLevelsArr: EnrollmentTrendData['gradeLevelInfoArr'] =
      [];

    for (const a of gradeLevels) {
      academicAndGradeLevelsArr.push({
        gradeLevel: a.grade_level.grade_level,
        gradeLevelOfferedId: a.grade_level_offered_id,
      });
    }

    return academicAndGradeLevelsArr;
  }

  private async get3Years(): Promise<Date[]> {
    const curretYear: Date = DateTimeUtilityService.getCurrentTimeStamp();

    const oneYearAgo: Date = new Date(curretYear.getFullYear() - 1, 0, 1);
    const twoYearsAgo: Date = new Date(curretYear.getFullYear() - 2, 0, 1);

    return [twoYearsAgo, oneYearAgo, curretYear];
  }

  private async getEnrollmentRecordCount(
    academicAndGradeCollection: EnrollmentTrendData['gradeLevelInfoArr'],
  ): Promise<EnrollmentTrendData['finalOutput']> {
    const threeYears: Date[] = await this.get3Years();

    const enrollmentTrendRecordArr: EnrollmentTrendData['enrollmentRecord'][] =
      [];

    for (const a of academicAndGradeCollection) {
      const enrollmentRecord: EnrollmentTrendData['enrollmentRecord'] = {
        grade: a.gradeLevel,
        [threeYears[0].getFullYear()]: 0,
        [threeYears[1].getFullYear()]: 0,
        [threeYears[2].getFullYear()]: 0,
      };

      for (let i = 0; i < 3; i++) {
        if (i != 2) {
          enrollmentRecord[threeYears[i].getFullYear()] =
            await this.prisma.enrollment_application.count({
              where: {
                grade_level_offered_id: a.gradeLevelOfferedId,
                application_datetime: {
                  gte: threeYears[i],
                  lt: threeYears[i + 1],
                },
              },
            });
        } else {
          enrollmentRecord[threeYears[i].getFullYear()] =
            await this.prisma.enrollment_application.count({
              where: {
                grade_level_offered_id: a.gradeLevelOfferedId,
                application_datetime: {
                  gte: threeYears[i],
                },
              },
            });
        }
      }

      enrollmentTrendRecordArr.push(enrollmentRecord);
    }

    return {
      record: enrollmentTrendRecordArr,
      years: [
        threeYears[0].getFullYear(),
        threeYears[1].getFullYear(),
        threeYears[2].getFullYear(),
      ],
    };
  }
}
