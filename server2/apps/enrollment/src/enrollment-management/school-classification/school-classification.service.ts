import { PrismaService } from './../../../../../libs/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { SchoolClassification } from './interface/school-classification.interface';
import { Prisma } from '@prisma/client';
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
    console.log('schoolData: ', schoolData);
    const result1: boolean = await this.allowModification(schoolId);

    // sends error message to client
    if (!result1)
      return this.microserviceUtility.conflictExceptionReturn(
        'Enrollment is ongoing. Modifications are no longer allowed.',
      );

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // delete the existing records that not match to the new records
        if (
          !(await this.deactivateOfferedGradeLevels(
            schoolId,
            schoolData.gradeLevels,
            schoolData.acadLevels,
            prisma,
          ))
        )
          return this.microserviceUtility.internalServerErrorReturn(
            'Failed to update records',
          );

        const result2 = await this.saveGradeLevels(
          schoolId,
          schoolData.gradeLevels,
          schoolData.acadLevels,
          prisma,
        );

        const result3 = await this.saveSchoolInfo(schoolData, schoolId);

        if (!result2.success || !result3)
          return this.microserviceUtility.internalServerErrorReturn(
            'Failed to save changes',
          );

        return {
          message: 'Updates applied successfully',
        };
      });

      return this.microserviceUtility.returnSuccess(result);
    } catch (error) {
      if (error instanceof Error) {
        return this.microserviceUtility.internalServerErrorReturn(
          error.message,
        );
      }

      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to save changes',
      );
    }
  }

  public async getAllGradesLavels(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const acadCodes: SchoolClassification['getDataReturnType'] =
      await this.getData(schoolId);

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
  private async allowModification(schoolId: number): Promise<boolean> {
    // get the count of students application
    const result = await this.prisma.enrollment_application.count({
      where: {
        grade_section_program: {
          grade_level_offered: {
            school_id: schoolId,
          },
        },
      },
    });

    return result > 0 ? false : true;
  }

  // step 2
  private async deactivateOfferedGradeLevels(
    schoolId: number,
    gradeLevelArr: string[],
    academicLevel: string[],
    prisma: Prisma.TransactionClient,
  ): Promise<boolean> {
    const result = await prisma.grade_level_offered.updateMany({
      where: {
        school_id: schoolId,
        grade_level: {
          grade_level: {
            notIn: gradeLevelArr,
          },
          academic_level: {
            academic_level: {
              notIn: academicLevel,
            },
          },
        },
      },
      data: {
        is_active: false,
      },
    });

    console.log(result);

    return result ? true : false;
  }

  // step 3
  private async saveGradeLevels(
    schoolId: number,
    newGradeLevelsArr: string[],
    academicLevels: string[],
    prisma: Prisma.TransactionClient,
  ): Promise<SchoolClassification['savingGradeLevelsStatus']> {
    console.log('newGradeLevelsArr: ', newGradeLevelsArr);
    console.log('academicLevels: ', academicLevels);

    const toBeCreateGradeLevels: string[] =
      await this.filterOutExistingGradeLevels(schoolId, academicLevels, prisma);

    console.log('toBeCreateGradeLevels: ', toBeCreateGradeLevels);

    const creationResult: boolean = await this.createGradeLevelOffered(
      schoolId,
      toBeCreateGradeLevels,
      prisma,
    );

    console.log('creationResult: ', creationResult);

    if (!creationResult) throw new Error('Failed saving grades');

    const activationResult: boolean = await this.activateInputGradeLevels(
      schoolId,
      newGradeLevelsArr,
      prisma,
    );

    console.log('activationResult: ', activationResult);

    if (!activationResult) throw new Error('Failed activating grades');

    return {
      success: true,
      message: 'Grade levels saved successfully',
    };
  }

  // step 3.1
  private async getGradeLevelsFromAcademicLevels(
    academicLevels: string[],
    prisma: Prisma.TransactionClient,
  ): Promise<SchoolClassification['gradeLevelFromAcademicLevel']> {
    const result = await prisma.grade_level.findMany({
      where: {
        academic_level: {
          academic_level: {
            in: academicLevels,
          },
        },
      },
      select: {
        grade_level_code: true,
        grade_level: true,
      },
    });

    return result.map((item) => ({
      gradeLevelCode: item.grade_level_code,
      gradeLevel: item.grade_level,
    }));
  }

  // step 3.2
  private async filterOutExistingGradeLevels(
    schoolId: number,
    academicLevels: string[],
    prisma: Prisma.TransactionClient,
  ): Promise<string[]> {
    console.log('academicLevels: ', academicLevels);
    const gradeLevelsFromAcademicLevels: SchoolClassification['gradeLevelFromAcademicLevel'] =
      await this.getGradeLevelsFromAcademicLevels(academicLevels, prisma);

    // eslint-disable-next-line
    console.log('gradeLevelsFromAcademicLevels: ', gradeLevelsFromAcademicLevels);

    const result = await prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        grade_level: {
          academic_level: {
            academic_level: {
              in: academicLevels,
            },
          },
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

    console.log('result: ', result);

    // eslint-disable-next-line
    return gradeLevelsFromAcademicLevels.filter((item) => {
        return !result.some(
          (grade) => grade.grade_level.grade_level == item.gradeLevel,
        );
      })
      .map((item) => item.gradeLevelCode);
  }

  private async createGradeLevelOffered(
    schoolId: number,
    gradeLevelCode: string[],
    prisma: Prisma.TransactionClient,
  ) {
    const result = await prisma.grade_level_offered.createMany({
      data: gradeLevelCode.map((gradeLevel) => ({
        school_id: schoolId,
        grade_level_code: gradeLevel,
        is_active: false,
        can_choose_section: false,
      })),
    });

    return result ? true : false;
  }

  private async activateInputGradeLevels(
    schoolId: number,
    gradeLevelArr: string[],
    prisma: Prisma.TransactionClient,
  ) {
    console.log('gradeLevelArr: ', gradeLevelArr);
    const result = await prisma.grade_level_offered.updateMany({
      where: {
        school_id: schoolId,
        grade_level: {
          grade_level: {
            in: gradeLevelArr,
          },
        },
      },
      data: {
        is_active: true,
      },
    });

    console.log('result: ', result);

    return result ? true : false;
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

    if (!data)
      return {
        schoolType,
        academicLevels: [],
        gradeLevels: [],
      };

    const academicLevels: string[] = await this.getAllAcademicLevels();
    const gradeLevels: string[] = await this.getOfferedGradeLevels(schoolId);

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
