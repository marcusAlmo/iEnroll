import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { DashboardPieGraph } from './dashboard-pie-graph.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class DashboardPieGraphService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async getPieGraphData(schoolId: number) {
    console.log('schoolId', schoolId);
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

  public async getPieGraphData(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    
  }
}
