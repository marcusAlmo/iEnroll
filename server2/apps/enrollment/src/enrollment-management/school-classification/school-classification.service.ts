import { GradeLevels } from '@/app/admin/pages/enrollment-management/grade-levels/gradelevels';
import { prismaVersion } from './../../../../../node_modules/.prisma/client/index.d';
import { PrismaService } from './../../../../../libs/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { SchoolClassification } from './interface/school-classification.interface';
import { school_type } from '@prisma/client';

@Injectable()
export class SchoolClassificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getShoolClasifications(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const schoolType: SchoolClassification['schoolInfoReturn'] = await this.getSchoolInfo(schoolId);
    const gradeLevels: string[] = await this.getAllOfferedGradeLevels(schoolId);

    return this.microserviceUtility.returnSuccess({
      schoolType: schoolType.schoolType,
      academicLevels: schoolType.acadLevels,
      gradeLevels: gradeLevels,
    });
  }

  public async saveSchoolClassification(
    schoolData: SchoolClassification['schoolInfoParam'],
    schoolId: number,
  ): Promise<MicroserviceUtility['successDataFormat']> {
    const result1: SchoolClassification['savingGradeLevels']['data'] | null =
      await this.determineIfDeletable(
        schoolId,
        schoolData.acadLevels,
      );

    if(result1 &&result1.offeredGradeLevels.length > 0)
      return this.microserviceUtility.conflictExceptionReturn(
        'The following academic levels are currently in use: ' + result1.offeredGradeLevels.join(', ')
      );

    
    return this.microserviceUtility.returnSuccess('Updates applied successfully')
  }

  // UTILITY FUNCTION

  // for fetching
  private async getSchoolInfo(
    schoolId: number,
  ): Promise<SchoolClassification['schoolInfoReturn']> {
    const schoolType = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
        is_active: true,
      },
      select: {
        school_type: true,
        supported_acad_level: true,
      },
    });

    const academicLevel: string[] = await this.getAcademicLevels(
      (schoolType?.supported_acad_level as string[]) || []
    );

    let schoolTypeValue: string | null = schoolType?.school_type?? null;

    return {
      schoolType: schoolTypeValue,
      acadLevels: academicLevel,
    };
  }

  private async getAcademicLevels(acadLevelCode: string[]): Promise<string[]> {
    const academicLevels = await this.prisma.academic_level.findMany({
      where: {
        academic_level_code: {
          in: acadLevelCode,
        },
        is_supported: true,
      },
      select: {
        academic_level: true,
      },
    });

    if (!academicLevels) return [];

    return academicLevels.map((acadLvl) => acadLvl.academic_level);
  }

  private async getAllOfferedGradeLevels(schoolId: number): Promise<string[]> {
    const gradeLevels = await this.prisma.grade_level_offered.findMany({
      where: {
        school: {
          school_id: schoolId,
          is_active: true,
        },
        is_active: true,
      },
      select: {
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    if (!gradeLevels) return [];

    return gradeLevels.map((grade) => grade.grade_level.grade_level);
  }

  // for saving updates or creating
  private async saveSchoolInfo(
    schoolData: SchoolClassification['schoolInfoParam'],
    schoolId: number,
  ): Promise<boolean> {
    const result = await this.prisma.school.update({
      where: {
        school_id: schoolId,
        is_active: true,
      },
      data: {
        school_type:
          schoolData.schoolType == 'public'
            ? school_type.public
            : schoolData.schoolType == 'private'
              ? school_type.private
              : school_type.others,
        supported_acad_level: schoolData.acadLevels,
      },
    });

    return result ? true : false;
  }

  private async saveSupportedGradeLevels(
    gradeLevels: string[],
    schoolId: number,
  ): Promise<SchoolClassification['savingGradeLevels']> {
    const result: SchoolClassification['savingGradeLevels']['data'] | null = await this.determineIfDeletable(
      schoolId,
      gradeLevels,
    );

    if (result && result.length > 0)
      return {
        status: false,
        message: `The following grade levels are currently in use: ${result.join(', ')}`,
        data: {
          offeredGradeLevels: [],
          ids: [],
        },
      };

    const result2 = await this.saveGradeLevels(schoolId, {
      offeredGradeLevels: ,
      ids: ,
    });

    return {
      status: true,
      message: 'Grade levels saved successfully',
    };
  }

  private async determineIfDeletable(
    schoolId: number,
    gradeLevelCodeArr: string[],
  ): Promise<SchoolClassification['savingGradeLevels']['data'] | null> {
    // get all the grade levels that are offered by the schools
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
      },
      select: {
        grade_level_offered_id: true,
        grade_level: { select: { grade_level: true } },
        enrollment_schedule: this.getSelectClause(),
        grade_section_program: this.getSelectClause(),
        enrollment_application: this.getSelectClause(),
      },
    });

    // determine if there are present offered grade levels
    if (!result || result.length == 0) return null;

    let enSched: number = 0;
    let gradSecProf: number = 0;
    let enApp: number = 0;

    // filter out the ones that matched the grade level code
    const filteredOutGradeLevels: SchoolClassification['fetchedOfferedGrades'][] =
      await this.filterOutData(result, gradeLevelCodeArr);

    const importantOfferedGradeLevels: string[] = [];

    // get all the ones that has been referenced by other tables
    for(const gradeLevel of filteredOutGradeLevels) {
      enSched = gradeLevel.enrollment_schedule.length;
      gradSecProf = gradeLevel.grade_section_program.length;
      enApp = gradeLevel.enrollment_application.length;

      if(enSched > 0 || gradSecProf > 0 || enApp > 0)
        importantOfferedGradeLevels.push(gradeLevel.grade_level.grade_level);
    }

    const idArr: number[] = [];

    const ttoBeReturnedValues: SchoolClassification['savingGradeLevels']['data'] = {
      offeredGradeLevels: importantOfferedGradeLevels,
      ids: idArr
    };

    return ttoBeReturnedValues;
  }

  // separated version of the select clause
  private getSelectClause() {
    return {
      select: {
        grade_level_offered: {
          select: {
            grade_level: {
              select: {
                grade_level: true
              },
            },
          },
        },
      },
    };
  }

  // this method filter out the data that not matches with the data
  private async filterOutData(
    offeredGradeLevelData: SchoolClassification['fetchedOfferedGrades'][],
    gradeLevelArr: string[]
  ): Promise<SchoolClassification['notMatchedGradeLevels']> {
    const toBeUpdated: number[] = [];
    const toBeDeleted: number[] = [];

    const filteredGradeLevels = offeredGradeLevelData.filter((r) => {
      const gradeLevel = r.grade_level.grade_level;

      if(gradeLevelArr.includes(gradeLevel))
        toBeUpdated.push(r.grade_level_offered_id);
      else
        toBeDeleted.push(r.grade_level_offered_id);

      return !gradeLevelArr.includes(gradeLevel);
    });

    return {
      grades: filteredGradeLevels,
      ids: {
        toBeUpdated,
        toBeDeleted,
      }
    };
  }

  // this method saves the grade levels
  private async saveGradeLevels(
    schoolId: number,
    gradeLevelsArr: string[],
  ): Promise<SchoolClassification['savingGradeLevelsStatus']> {
    
  }
}
