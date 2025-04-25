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
    
  }


  // UTILITY FUNCTIONS

  // for retrieving the grade levels
  private async retrievedata(schoolId: number) {
    const data = await this.prisma.grade_section_program.findMany({
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
          }
        }
      }
    });
  }
}
