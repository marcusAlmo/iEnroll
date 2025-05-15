import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { DashboardPieGraph } from './interfaces/dashboard-pie-graph.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { CardsService } from '../cards/cards.service';
import { AcademicYear } from '../cards/interfaces/cards.interface';
@Injectable()
export class PieGraphService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly cardsService: CardsService,
  ) {}

  public async getPieGraphData(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const gradeLevelsCollection = await this.getAllGradesWithCode(schoolId);

    const academicYear: AcademicYear['returnValue']['data'] =
      await this.cardsService.getAcademicYear(schoolId);

    if (!academicYear)
      return this.microserviceUtilityService.notFoundExceptionReturn(
        'Academic Year not found',
      );

    const pieGraphData: DashboardPieGraph['pieGraphData'] | null =
      await this.getEnrollmentCountByGradeLevel(
        gradeLevelsCollection,
        academicYear,
      );

    if (!pieGraphData)
      return this.microserviceUtilityService.returnSuccess({
        gradeEnrollmentCollections: [],
        totalEnrollmentCount: 0,
      });

    return this.microserviceUtilityService.returnSuccess({
      gradeEnrollmentCollections: pieGraphData.gradeEnrollmentCollections,
      totalEnrollmentCount: pieGraphData.totalEnrollmentCount,
    });
  }

  public async getAllGrades(
    schoolId: number,
  ): Promise<DashboardPieGraph['gradeLevels']> {
    const grades = await this.prisma.grade_level_offered.findMany({
      where: { is_active: true, school_id: schoolId },
      select: {
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    if (!grades) return { data: [] };

    const gradeLevels: DashboardPieGraph['gradeLevels']['data'] = grades.map(
      (grade) => grade.grade_level.grade_level,
    );

    return { data: gradeLevels };
  }

  // UTILITY FUNCTIONS

  private async getAllGradesWithCode(
    schoolId: number,
  ): Promise<DashboardPieGraph['gradeLevelsWithCode']> {
    const grades = await this.prisma.grade_level_offered.findMany({
      where: { school_id: schoolId, is_active: true },
      select: {
        grade_level: {
          select: {
            grade_level: true,
            grade_level_code: true,
          },
        },
      },
    });

    if (!grades) return [];

    const gradeLevels: DashboardPieGraph['gradeLevelsWithCode'] = grades.map(
      (item) => ({
        gradeLevel: item.grade_level.grade_level,
        gradeLevelCode: item.grade_level.grade_level_code,
      }),
    );

    return gradeLevels;
  }

  private async getEnrollmentCountByGradeLevel(
    gradeLevelsWithCode: DashboardPieGraph['gradeLevelsWithCode'],
    academicYear: AcademicYear['returnValue']['data'],
  ): Promise<DashboardPieGraph['pieGraphData'] | null> {
    if (!academicYear) return null;

    let totalCount = 0;
    const pieGraphData: DashboardPieGraph['pieGraphData']['gradeEnrollmentCollections'] =
      [];

    for (const g of gradeLevelsWithCode) {
      const enrollmentCount = await this.prisma.enrollment_application.count({
        where: {
          grade_level_program: {
            grade_level_offered: {
              grade_level_code: g.gradeLevelCode,
            },
          },
        },
      });

      totalCount += enrollmentCount;

      pieGraphData.push({
        name: g.gradeLevel,
        value: 5,
      });
    }

    return {
      gradeEnrollmentCollections: pieGraphData,
      totalEnrollmentCount: totalCount,
    };
  }
}
