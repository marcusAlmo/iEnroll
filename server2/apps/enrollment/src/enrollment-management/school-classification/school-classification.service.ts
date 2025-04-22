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

  public async getShoolClassifications(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const schoolType: SchoolClassification['schoolInfoReturn'] =
      await this.getSchoolInfo(schoolId);

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
  ): Promise<MicroserviceUtility['returnValue']> {
    const result1: SchoolClassification['deletableReturn'] | null =
      await this.determineIfDeletable(schoolId, schoolData.gradeLevels);

    // sends error message to client
    if (result1.grades.length > 0)
      return this.microserviceUtility.conflictExceptionReturn(
        'The following academic levels are currently in use: ' +
          result1.grades.join(', '),
      );

    // delete the existing records that not match to the new records
    if (!(await this.deleteOfferedGradesRecord(result1.ids)))
      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to update records',
      );

    const result2 = await this.saveGradeLevels(
      schoolId,
      schoolData.gradeLevels,
    );
    const result3 = await this.saveSchoolInfo(schoolData, schoolId);

    if (!result2.success || !result3)
      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to save changes',
      );

    return this.microserviceUtility.returnSuccess({
      message: 'Updates applied successfully',
    });
  }

  // UTILITY FUNCTION

  // === for fetching ===

  // step 1
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
      (schoolType?.supported_acad_level as string[]) || [],
    );

    const schoolTypeValue: string | null = schoolType?.school_type ?? null;

    return {
      schoolType: schoolTypeValue,
      acadLevels: academicLevel,
    };
  }

  // step 1.1
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

  // step 2
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

  // === for saving updates or creating ===

  // step 1
  private async determineIfDeletable(
    schoolId: number,
    gradeLevelCodeArr: string[],
  ): Promise<SchoolClassification['deletableReturn']> {
    // get all the grade levels that are offered by the schools
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        is_active: true,
        grade_level: {
          grade_level: {
            notIn: gradeLevelCodeArr,
          },
        },
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
    if (!result || result.length == 0)
      return {
        grades: [],
        ids: [],
      };

    let enSched: number = 0;
    let gradSecProf: number = 0;
    let enApp: number = 0;

    const importantOfferedGradeLevels: string[] = [];
    const idArr: number[] = [];

    // get all the ones that has been referenced by other tables
    for (const gradeLevel of result) {
      enSched = gradeLevel.enrollment_schedule.length;
      gradSecProf = gradeLevel.grade_section_program.length;
      enApp = gradeLevel.enrollment_application.length;

      if (enSched > 0 || gradSecProf > 0 || enApp > 0)
        importantOfferedGradeLevels.push(gradeLevel.grade_level.grade_level);

      idArr.push(gradeLevel.grade_level_offered_id);
    }

    const ttoBeReturnedValues: SchoolClassification['deletableReturn'] = {
      grades: importantOfferedGradeLevels,
      ids: idArr,
    };

    return ttoBeReturnedValues;
  }

  // step 1.1 (select clause base)
  private getSelectClause() {
    return {
      select: {
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
    };
  }

  // step 2
  private async deleteOfferedGradesRecord(idArr: number[]): Promise<boolean> {
    const result = await this.prisma.grade_level_offered.deleteMany({
      where: {
        grade_level_offered_id: {
          in: idArr,
        },
      },
    });

    return result ? true : false;
  }

  // step 3
  private async saveGradeLevels(
    schoolId: number,
    newGradeLevelsArr: string[],
  ): Promise<SchoolClassification['savingGradeLevelsStatus']> {
    // filter the existing ones
    const toBeSaved: string[] = await this.filterExistingOnes(
      schoolId,
      newGradeLevelsArr,
    );

    if (toBeSaved.length == 0)
      return {
        success: false,
        message: 'No new grade levels to save',
      };

    const result = await this.prisma.grade_level_offered.createMany({
      data: toBeSaved.map((gradeLevel) => ({
        school_id: schoolId,
        grade_level_code: gradeLevel,
        is_active: true,
      })),
    });

    if (!result)
      return {
        success: false,
        message: 'Failed to save grade levels',
      };

    return {
      success: true,
      message: 'Grade levels saved successfully',
    };
  }

  // step 3.1
  private async filterExistingOnes(
    schoolId: number,
    newGradeLevelsArr: string[],
  ): Promise<string[]> {
    const sameGradeLevel = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        grade_level: {
          grade_level: {
            in: newGradeLevelsArr,
          },
        },
      },
      select: {
        grade_level: {
          select: {
            grade_level: true,
          },
        },
        grade_level_code: true,
      },
    });

    const gradeLevelArr: string[] = newGradeLevelsArr.filter(
      (gradeLevel) =>
        !sameGradeLevel.some(
          (item) => item.grade_level.grade_level === gradeLevel,
        ),
    );

    const newGradeLevelCode: { grade_level_code: string }[] =
      await this.prisma.grade_level.findMany({
        where: {
          grade_level: {
            in: gradeLevelArr,
          },
        },
        select: {
          grade_level_code: true,
        },
      });

    return newGradeLevelCode.map((gradeLevel) => gradeLevel.grade_level_code);
  }

  // step 4
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
        supported_acad_level: JSON.stringify(schoolData.acadLevels),
      },
    });

    return result ? true : false;
  }
}
