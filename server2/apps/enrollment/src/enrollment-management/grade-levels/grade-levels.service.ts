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

  public async getGradeLevels(
    schoolId: number,
  ): Promise<GradeLevels['selectedGadeLevels']> {
    const gradeLevels: GradeLevels['selectedGadeLevels'] =
      await this.prisma.grade_level_offered.findMany({
        where: {
          school_id: schoolId,
          is_active: true,
        },
        select: {
          grade_level: {
            select: {
              grade_level_code: true,
              grade_level: true,
            },
          },
          grade_section_program: {
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
                  program_id: true,
                  program: true,
                },
              },
            },
          },
        },
      });

    if (!gradeLevels) return [];

    return gradeLevels;
  }
}
