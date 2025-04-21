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

  private async saveSupportedGradeLevels() {
    const result = await this.prisma.
  }
}
