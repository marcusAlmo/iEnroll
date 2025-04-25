import { GradeLevels } from './interface/grade-levels.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Injectable()
export class GradeLevelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getGradeLevels(schoolId: number) {
    const data: GradeLevels['fixedFormat'][] =
      await this.retrievedata(schoolId);

    return this.microserviceUtility.returnSuccess(data);
  }

  public async createAndUpdateGradeLevel() {
    
  }

  // UTILITY FUNCTIONS

  // for retrieving the grade levels
  private async retrievedata(
    schoolId: number,
  ): Promise<GradeLevels['fixedFormat'][]> {
    const data: GradeLevels['gradeLevels'] =
      await this.prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            school_id: schoolId,
            is_active: true,
          },
        },
        select: {
          grade_section: {
            select: {
              grade_section_id: true,
              section_name: true,
              adviser: true,
              admission_slot: true,
              max_application_slot: true,
            },
          },
          academic_program: {
            select: {
              program: true,
            },
          },
          grade_level_offered: {
            select: {
              grade_level: {
                select: {
                  grade_level: true,
                },
              },
            },
          },
        },
      });

    if (!data || data.length == 0) return [];

    const finalData: GradeLevels['fixedFormat'][] = [];

    data.forEach((item) => {
      finalData.push({
        gradeLevel: item.grade_level_offered.grade_level.grade_level,
        sections: item.grade_section.map((section) => ({
          sectionId: section.grade_section_id,
          sectionName: section.section_name,
          adviser: section.adviser,
          admissionSlot: section.admission_slot,
          maxApplicationSlot: section.max_application_slot,
          program: item.academic_program.program,
        })),
      });
    });

    return finalData;
  }
}
