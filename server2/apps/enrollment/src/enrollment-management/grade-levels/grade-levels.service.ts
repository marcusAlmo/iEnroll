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
    programname: string | undefined,
    programId: number | undefined,
    sectionName: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
    gradeSectionProgramId: number,
    isUpdate: boolean,
  ): Promise<MicroserviceUtility['returnValue']> {
    console.log({
      gradeLevelOfferedId,
      sectionId,
      programname,
      sectionName,
      adviser,
      admissionSlot,
      maxApplicationSlot,
      gradeSectionProgramId,
      programId,
    });
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

    // Use a Map to consolidate grade levels by grade level name
    const gradeLevelMap = new Map<string, GradeLevels['fixedFormat']>();

    data.forEach((item) => {
      const gradeLevelName = item.grade_level_offered.grade_level.grade_level;
      const sections = item.grade_section.map((section) => ({
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
      }));

      if (gradeLevelMap.has(gradeLevelName)) {
        // If this grade level already exists in our map, add the sections to it
        const existingGradeLevel = gradeLevelMap.get(gradeLevelName)!;
        existingGradeLevel.sections = [
          ...existingGradeLevel.sections,
          ...sections,
        ];
      } else {
        // Otherwise, create a new entry in the map
        gradeLevelMap.set(gradeLevelName, {
          gradeLevel: gradeLevelName,
          gradeSectionProgramId: item.grade_section_program_id,
          gradeLevelOfferedId: item.grade_level_offered.grade_level_offered_id,
          sections: sections,
        });
      }
    });

    // Convert the map values to an array for the final result
    return Array.from(gradeLevelMap.values());
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
    console.log('data: ', {
      gradeLevelOfferedId,
      sectionId,
      programname,
      sectionName,
      adviser,
      admissionSlot,
      maxApplicationSlot,
      gradeSectionProgramId,
      programId,
    });

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
          console.log('Creating section program');
          const gradeSectionProgrmId: number = await this.createSectionProgram(
            gradeLevelOfferedId,
            programId,
            prisma,
          );

          console.log('gradeSectionProgrmId: ', gradeSectionProgrmId);

          console.log('Updating grade section');

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
    console.log('data2: ', {
      gradeLevelOfferedId,
      program,
    });
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

    console.log('data3: ', {
      data,
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

    console.log('data4: ', {
      gradeLevelOfferedId,
      programId,
    });
    const data = await prisma.grade_section_program.create({
      data: {
        grade_level_offered_id: gradeLevelOfferedId,
        program_id: programId,
      },
    });

    console.log('data5: ', {
      data,
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
    console.log({
      gradeSectionProgramId,
      sectionId,
      name,
      adviser,
      admissionSlot,
      maxApplicationSlot,
    });

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

    console.log(data);

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
