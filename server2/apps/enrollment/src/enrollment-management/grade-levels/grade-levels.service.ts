import { GradeLevels } from './interface/grade-levels.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { Prisma } from '@prisma/client';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class GradeLevelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  // retrieve grade levels including nnecessary informations
  public async getGradeLevels(schoolId: number) {
    const data: GradeLevels['fixedFormat'][] =
      await this.retrievedata(schoolId);

    return this.microserviceUtility.returnSuccess(data);
  }

  // create and update grade levels
  public async createAndUpdateGradeLevel(
    schoolId: number,
    gradeLevelOfferedId: number,
    sectionId: number | undefined,
    programname: string | undefined,
    programId: number | undefined,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    gradeSectionProgramId: number | undefined,
    isUpdate: boolean,
  ): Promise<MicroserviceUtility['returnValue']> {
    if (isUpdate) {
      if (!sectionId)
        return this.microserviceUtility.badRequestExceptionReturn(
          'Section id is missing in the data',
        );

      if (!gradeSectionProgramId)
        return this.microserviceUtility.badRequestExceptionReturn(
          'Grade section program id is missing in the data',
        );

      const output: { message: string } = await this.updateSection(
        gradeLevelOfferedId,
        sectionId,
        programname,
        sectionName,
        adviser,
        admissionSlot,
        maxApplicationSlot,
        gradeSectionProgramId,
        programId,
      );

      return this.microserviceUtility.returnSuccess(output);
    } else {
      try {
        const result = await this.prisma.$transaction(async (prisma) => {
          const output: { message: string } = await this.createSection(
            programId,
            sectionName,
            adviser,
            admissionSlot,
            maxApplicationSlot,
            prisma,
            gradeLevelOfferedId,
          );

          return output;
        });

        return this.microserviceUtility.returnSuccess(result);
        // eslint-disable-next-line
      } catch (err) {
        return this.microserviceUtility.internalServerErrorReturn(
          'An error has occured while applying changes',
        );
      }
    }
  }

  // retrieve the list of program ids
  public async retrievePrograms(): Promise<MicroserviceUtility['returnValue']> {
    const data = await this.prisma.academic_program.findMany({
      select: {
        program_id: true,
        program: true,
        description: true,
      },
    });

    if (!data || data.length == 0)
      return this.microserviceUtility.returnSuccess({
        programList: [],
      });

    const finalOutput: GradeLevels['programList'] = data.map((item) => ({
      programId: item.program_id,
      program: item.program,
      description: item.description,
    }));

    return this.microserviceUtility.returnSuccess({
      programList: finalOutput,
    });
  }

  // delete grade levels
  public async deleteGradeSection(
    sectionId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.prisma.grade_section.delete({
      where: {
        grade_section_id: sectionId,
      },
    });

    return this.microserviceUtility.returnSuccess({
      message: result ? 'Deleted successfully' : 'Failed to delete',
    });
  }

  // UTILITY FUNCTIONS

  // for retrieving the grade levels

  private async retrievedata(
    schoolId: number,
  ): Promise<GradeLevels['fixedFormat'][]> {
    // fetch supported academic levels
    const supportedAcademicLevels: string[] =
      await this.supportedAcademicLevels(schoolId);

    const gradeLevelsOnly = await this.retrieveGradeLevelsOnly(
      supportedAcademicLevels,
      schoolId,
    );

    const data: GradeLevels['gradeLevels'] =
      await this.prisma.grade_level_offered.findMany({
        where: {
          school_id: schoolId,
          is_active: true,
        },
        select: {
          grade_level_offered_id: true,
          grade_level_code: true,
          grade_level: {
            select: {
              grade_level: true,
            },
          },
          grade_section_program: {
            select: {
              grade_section_program_id: true, // Added this missing field
              academic_program: {
                select: {
                  program: true,
                  description: true,
                },
              },
              grade_section: {
                select: {
                  grade_section_id: true,
                  section_name: true,
                  adviser: true,
                  admission_slot: true,
                  max_application_slot: true,
                },
              },
            },
          },
        },
      });

    if (!gradeLevelsOnly || gradeLevelsOnly.length === 0) return [];

    // Create a lookup map of data by grade level code
    const dataByGradeLevelCode = new Map<
      string,
      GradeLevels['gradeLevels'][0]
    >();

    data.forEach((item) => {
      dataByGradeLevelCode.set(item.grade_level_code, item);
    });

    // Build the result by iterating through gradeLevelsOnly
    const result: GradeLevels['fixedFormat'][] = [];

    for (const gradeLevel of gradeLevelsOnly) {
      const gradeData = dataByGradeLevelCode.get(gradeLevel.gradeLevelCode);

      const sections = (gradeData?.grade_section_program || []).flatMap(
        (program) =>
          program.grade_section.map((section) => ({
            gradeSectionProgramId: program.grade_section_program_id,
            sectionId: section.grade_section_id,
            sectionName: section.section_name,
            adviser: section.adviser,
            admissionSlot: section.admission_slot,
            maxApplicationSlot: section.max_application_slot,
            programDetails: program.academic_program
              ? {
                  program: program.academic_program.program,
                  description: program.academic_program.description,
                }
              : undefined,
            isCustomProgram: !program.academic_program,
          })),
      );
      result.push({
        gradeLevel: gradeLevel.gradeLevel,
        gradeSectionProgramId:
          gradeData?.grade_section_program[0]?.grade_section_program_id || 0,
        gradeLevelOfferedId: gradeLevel.gradeLevelOfferedId,
        sections: sections,
      });
    }

    return result;
  }

  private async supportedAcademicLevels(schoolId: number) {
    const result = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        supported_acad_level: true,
      },
    });

    return result?.supported_acad_level
      ? (result.supported_acad_level as string[])
      : [];
  }

  private async retrieveGradeLevelsOnly(
    academicLevels: string[],
    schoolId: number,
  ): Promise<GradeLevels['retrievedGradeLevels'][]> {
    const data = await this.prisma.grade_level.findMany({
      where: {
        academic_level: {
          academic_level: {
            in: academicLevels,
          },
        },
      },
      select: {
        grade_level: true,
        grade_level_code: true,
        grade_level_offered: {
          where: {
            school_id: schoolId,
            is_active: true,
          },
          select: {
            grade_level_offered_id: true,
          },
        },
      },
    });

    if (!data || data.length == 0) return [];

    const finalOutput: GradeLevels['retrievedGradeLevels'][] = data
      .filter((item) => item.grade_level_offered.length > 0) // Only include grade levels with active offers
      .map((item) => ({
        gradeLevel: item.grade_level,
        gradeLevelCode: item.grade_level_code,
        gradeLevelOfferedId: item.grade_level_offered[0].grade_level_offered_id,
      }));

    return finalOutput;
  }

  // for storing the grade levels section

  private async updateSection(
    gradeLevelOfferedId: number,
    sectionId: number,
    programname: string | undefined,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    gradeSectionProgramId: number,
    programId: number | undefined,
  ) {
    const id = await this.determineifExists(gradeLevelOfferedId, programname);

    if (id != null) {
      await this.prisma.grade_section.update({
        where: {
          grade_section_id: sectionId,
        },
        data: {
          section_name: sectionName,
          adviser: adviser,
          admission_slot: admissionSlot,
          max_application_slot: maxApplicationSlot,
        },
      });

      return { message: 'Updated successfully' };
    } else {
      try {
        const result = await this.prisma.$transaction(async (prisma) => {
          const gradeSectionProgrmId: number = await this.createSectionProgram(
            gradeLevelOfferedId,
            programId,
            prisma,
          );

          await this.updateGradeSection(
            gradeSectionProgrmId,
            sectionId,
            sectionName,
            adviser,
            admissionSlot,
            maxApplicationSlot,
            prisma,
          );

          return { message: 'Updated successfully' };
        });

        return result;
        // eslint-disable-next-line
      } catch (err) {
        return { message: 'An error has occured while updating' };
      }
    }
  }

  // this method determines if the program has been changed
  private async determineifExists(
    gradeLevelOfferedId: number,
    program: string | undefined,
  ): Promise<number | null> {
    if (!program) return 3;

    const data = await this.prisma.grade_section_program.findFirst({
      where: {
        grade_level_offered_id: gradeLevelOfferedId,
        academic_program: {
          program: program,
        },
      },
      select: {
        program_id: true,
      },
    });

    return data ? data.program_id : null;
  }

  // create a new grade section program
  private async createSectionProgram(
    gradeLevelOfferedId: number,
    programId: number | undefined,
    prisma: Prisma.TransactionClient,
  ): Promise<number> {
    if (!programId) throw new Error('Program id is required');

    const data = await prisma.grade_section_program.create({
      data: {
        grade_level_offered_id: gradeLevelOfferedId,
        program_id: programId,
      },
    });

    return data.grade_section_program_id;
  }

  // update the grade section
  private async updateGradeSection(
    gradeSectionProgramId: number,
    sectionId: number,
    name: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const data = await prisma.grade_section.update({
      where: {
        grade_section_id: sectionId,
      },
      data: {
        grade_section_program_id: gradeSectionProgramId,
        section_name: name,
        adviser: adviser,
        admission_slot: admissionSlot,
        max_application_slot: maxApplicationSlot,
      },
    });

    if (!data) throw new Error('An error has occured while applying changes');
  }

  private async createSection(
    programId: number | undefined,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    prisma: Prisma.TransactionClient,
    gradeLevelOfferedid: number,
  ) {
    if (!programId) return { message: 'Related information not found' };

    const data = await prisma.grade_section_program.findFirst({
      where: {
        program_id: programId,
        grade_level_offered_id: gradeLevelOfferedid,
      },
      select: {
        grade_section_program_id: true,
      },
    });

    let gradeSectionProgramId: number = 0;

    if (!data) {
      gradeSectionProgramId = await this.createSectionProgram(
        gradeLevelOfferedid,
        programId,
        prisma,
      );
    }

    const result = await prisma.grade_section.create({
      data: {
        grade_section_program_id: gradeSectionProgramId,
        section_name: sectionName,
        adviser: adviser,
        admission_slot: admissionSlot,
        max_application_slot: maxApplicationSlot,
      },
    });

    return result
      ? { message: 'Section created successfully' }
      : { message: 'An error has occured while creating' };
  }
}
