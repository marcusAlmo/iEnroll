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
    console.log('result2: ', result2, 'result3: ', result3);

    if (!result2.success || !result3)
      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to save changes',
      );

    return this.microserviceUtility.returnSuccess({
      message: 'Updates applied successfully',
    });
  }

  public async getAllGradesLavels(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    console.log(schoolId);
    const acadCodes: SchoolClassification['getDataReturnType'] =
      await this.getData(schoolId);
    console.log(acadCodes);

    const finalData: SchoolClassification['finalOutput'] =
      await this.getCompleteAcadAndGradeLevels(
        acadCodes.supportedAcadLevel,
        schoolId,
        acadCodes.schoolType,
      );

    return this.microserviceUtility.returnSuccess(finalData);
  }

  // UTILITY FUNCTION 10

  // === for saving updates or creating ===

  // step 1
  private async determineIfDeletable(
    schoolId: number,
    gradeLevelArr: string[],
  ): Promise<SchoolClassification['deletableReturn']> {
    // get all the grade levels that are offered by the schools
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        is_active: true,
        grade_level: {
          grade_level: {
            notIn: gradeLevelArr,
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
        success: true,
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
        supported_acad_level: schoolData.acadLevels,
      },
    });

    return result ? true : false;
  }

  // === for fetching all the academic levels and grade levels

  // step1
  private async getData(
    schoolId: number,
  ): Promise<SchoolClassification['getDataReturnType']> {
    const data = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
        is_active: true,
      },
      select: {
        supported_acad_level: true,
        school_type: true,
      },
    });

    if (!data)
      return {
        schoolType: 'others',
        supportedAcadLevel: [],
      };

    return {
      schoolType: data.school_type,
      supportedAcadLevel: data.supported_acad_level as string[],
    };
  }

  private async getCompleteAcadAndGradeLevels(
    acadLevels: string[],
    schoolId: number,
    schoolType: string,
  ): Promise<SchoolClassification['finalOutput']> {
    const data = await this.prisma.academic_level.findMany({
      where: {
        academic_level: {
          in: acadLevels,
        },
      },
      select: {
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    console.log(data);

    console.log('data: ', data);
    console.log('acadLevels: ', acadLevels);

    if (!data)
      return {
        schoolType,
        academicLevels: [],
        gradeLevels: [],
      };

    const academicLevels: string[] = await this.getAllAcademicLevels();
    const gradeLevels: string[] = await this.getOfferedGradeLevels(schoolId);

    console.log('academicLevelOffered: ', acadLevels);
    console.log('academicLevels: ', academicLevels);
    console.log('gradeLevels: ', gradeLevels);

    return {
      schoolType,
      academicLevels: academicLevels.map((item) => ({
        name: item,
        checked: acadLevels.includes(item),
      })),
      gradeLevels: data.flatMap((item) =>
        item.grade_level.map((grade) => ({
          name: grade.grade_level,
          checked: gradeLevels.includes(grade.grade_level),
        })),
      ),
    };
  }

  private async getAllAcademicLevels(): Promise<string[]> {
    const data = await this.prisma.academic_level.findMany({
      select: {
        academic_level: true,
      },
    });

    if (!data) return [];

    return data.map((item) => item.academic_level);
  }

  private async getOfferedGradeLevels(schoolId: number): Promise<string[]> {
    const gradeLevels = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
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

    return gradeLevels.map((item) => item.grade_level.grade_level);
  }
}
