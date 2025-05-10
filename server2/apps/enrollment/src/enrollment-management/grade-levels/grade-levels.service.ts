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
    gradeLevelOfferedId: number,
    sectionId: number,
    programname: string,
    programId: number,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    gradeSectionProgramId: number,
    isUpdate: boolean,
  ): Promise<MicroserviceUtility['returnValue']> {
    if (isUpdate) {
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
      },
    });

    if (!data || data.length == 0)
      return this.microserviceUtility.returnSuccess({
        programList: [],
      });

    const finalOutput: GradeLevels['programList'] = data.map((item) => ({
      programId: item.program_id,
      program: item.program,
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
    const data: GradeLevels['gradeLevels'] =
      await this.prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            school_id: schoolId,
            is_active: true,
          },
        },
        select: {
          grade_section_program_id: true,
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
              description: true,
            },
          },
          grade_level_offered: {
            select: {
              grade_level_offered_id: true,
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
        gradeLevelOfferedId: item.grade_level_offered.grade_level_offered_id,
        sections: item.grade_section.map((section) => ({
          gradeSectionProgramId: item.grade_section_program_id,
          sectionId: section.grade_section_id,
          sectionName: section.section_name,
          adviser: section.adviser,
          admissionSlot: section.admission_slot,
          maxApplicationSlot: section.max_application_slot,
          programDetails: item.academic_program
            ? {
                program: item.academic_program.program,
                description: item.academic_program.description,
              }
            : undefined,
          isCustomProgram: item.academic_program ? false : true,
        })),
      });
    });

    return finalData;
  }

  // for storing the grade levels section

  private async updateSection(
    gradeLevelOfferedId: number,
    sectionId: number,
    programname: string,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    gradeSectionProgramId: number,
    programId: number,
  ) {
    if (await this.determineifExists(gradeSectionProgramId, programname)) {
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
    gradeSectionProgramId: number,
    program: string,
  ): Promise<boolean> {
    const data = await this.prisma.grade_section_program.findFirst({
      where: {
        grade_section_program_id: gradeSectionProgramId,
        academic_program: {
          program: program,
        },
      },
      select: {
        program_id: true,
      },
    });

    return data ? true : false;
  }

  // create a new grade section program
  private async createSectionProgram(
    gradeLevelOfferedId: number,
    programId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<number> {
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
        grade_section_id: gradeSectionProgramId,
        section_name: name,
        adviser: adviser,
        admission_slot: admissionSlot,
        max_application_slot: maxApplicationSlot,
      },
    });

    if (!data) throw new Error('An error has occured while applying changes');
  }

  private async createSection(
    programId: number,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    prisma: Prisma.TransactionClient,
    gradeLevelOfferedid: number,
  ) {
    const data = await prisma.grade_section_program.findFirst({
      where: {
        program_id: programId,
        grade_level_offered_id: gradeLevelOfferedid,
      },
      select: {
        grade_section_program_id: true,
      },
    });

    if (!data) return { message: 'Related information not found' };

    const result = await prisma.grade_section.create({
      data: {
        grade_section_program_id: data.grade_section_program_id,
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
