import { $Enums, Prisma } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { Requirements } from './interface/requirements.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class RequirementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getAllRequirements(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const rawData: Requirements['retrieveRequirementsRaw'] =
      await this.getAllRequirementsRaw(schoolId);

    const processedData: Requirements['processedRequirements'] =
      await this.processRetrieveData(rawData);

    return this.microserviceUtility.returnSuccess(processedData);
  }

  public async processReceivedData(
    data: Requirements['receivedData'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const idArr: number[] = [];

    const {
      tobeCreated,
      toBeCreatedRequirements,
    }: Requirements['dataForProcessing'] = await this.getGradeSectionProgram(
      data.gradeLevelCodes,
      schoolId,
    );

    idArr.push(...toBeCreatedRequirements);

    if (tobeCreated.length > 0) {
      const programId: number = await this.retrieveProgramId();

      const gradeLevelOfferedIdArr: number[] =
        await this.retrieveGradeLevelOfferedIdArr(tobeCreated, schoolId);

      const gradeSectionProgramIdArr = await this.createGradeSectionProgram(
        gradeLevelOfferedIdArr,
        programId,
        this.prisma,
      );

      idArr.push(...gradeSectionProgramIdArr);
    }

    if (data.sectionId.length > 0) {
      const gradeSectionProgramIdArr: number[] =
        await this.retrieveGradeSectionProgramIdArr(data.sectionId);

      idArr.push(...gradeSectionProgramIdArr);
    }

    const finalData: Requirements['finalData'][] =
      await this.processToBeCreatedRequirements(idArr, data);

    const result = await this.createRequirements(finalData);

    if (result) {
      return this.microserviceUtility.returnSuccess({
        message: 'Requirements created successfully',
      });
    } else {
      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to create requirements',
      );
    }
  }

  public async deleteRequirement(
    requirementId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.prisma.enrollment_requirement.delete({
      where: {
        requirement_id: requirementId,
      },
    });

    if (result) {
      return this.microserviceUtility.returnSuccess({
        message: 'Requirement deleted successfully',
      });
    } else {
      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to delete requirement',
      );
    }
  }

  public async updateRequirement(
    data: Requirements['updateRequirement'][],
  ): Promise<MicroserviceUtility['returnValue']> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        for (const requirement of data) {
          const result1 = await prisma.enrollment_requirement.update({
            where: {
              requirement_id: requirement.requirementId,
            },
            data: {
              is_required: requirement.isRequired,
              name: requirement.name,
              requirement_type: requirement.type as $Enums.requirement_type,
              accepted_data_type:
                requirement.dataType as $Enums.accepted_data_type,
              description: requirement.description,
            },
          });

          if (!result1) {
            throw new Error('Failed to update requirement');
          }
        }

        return {
          message: 'Requirement updated successfully',
        };
      });

      if (result) {
        return this.microserviceUtility.returnSuccess(result);
      } else {
        return this.microserviceUtility.internalServerErrorReturn(
          'Failed to update requirement',
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        return this.microserviceUtility.internalServerErrorReturn(err.message);
      }

      return this.microserviceUtility.internalServerErrorReturn(
        'Failed to update requirement',
      );
    }
  }

  // UTILITY FUNCTIONS

  // for retrieval
  private async getAllRequirementsRaw(
    schoolId: number,
  ): Promise<Requirements['retrieveRequirementsRaw']> {
    const requirements: Requirements['retrieveRequirementsRaw'] =
      await this.prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            school_id: schoolId,
          },
        },
        select: {
          grade_section_program_id: true,
          grade_level_offered: {
            select: {
              grade_level: {
                select: {
                  grade_level_code: true,
                  grade_level: true,
                },
              },
            },
          },
          grade_level_offered_id: true,
          enrollment_requirement: {
            select: {
              requirement_id: true,
              name: true,
              requirement_type: true,
              accepted_data_type: true,
              is_required: true,
              description: true,
            },
          },
        },
        orderBy: {
          grade_level_offered: {
            grade_level: {
              order_position: 'asc',
            },
          },
        },
      });

    if (!requirements || requirements.length == 0) return [];

    return requirements;
  }

  private async processRetrieveData(
    data: Requirements['retrieveRequirementsRaw'],
  ): Promise<Requirements['processedRequirements']> {
    // First transform all data to the desired format
    const transformedData = data.map((item) => ({
      gradeSectionProgramId: item.grade_section_program_id,
      gradeLevelOfferedId: item.grade_level_offered_id,
      gradeLevel: item.grade_level_offered.grade_level.grade_level,
      gradeLevelCode: item.grade_level_offered.grade_level.grade_level_code,
      requirements: item.enrollment_requirement.map((requirement) => ({
        requirementId: requirement.requirement_id,
        name: requirement.name,
        type: requirement.requirement_type,
        dataType: requirement.accepted_data_type,
        isRequired: requirement.is_required,
        description: requirement.description,
      })),
    }));

    // Create a map to group by gradeLevelOfferedId
    const gradeLevelMap = new Map<number, (typeof transformedData)[0]>();

    for (const item of transformedData) {
      if (gradeLevelMap.has(item.gradeLevelOfferedId)) {
        // If we've seen this grade level before, merge the requirements
        const existing = gradeLevelMap.get(item.gradeLevelOfferedId);
        existing!.requirements.push(...item.requirements);
      } else {
        // First time seeing this grade level, add to map
        gradeLevelMap.set(item.gradeLevelOfferedId, {
          ...item,
          // Create a new array to avoid reference issues
          requirements: [...item.requirements],
        });
      }
    }

    // Convert the map values back to an array
    return Array.from(gradeLevelMap.values());
  }

  // for creating new
  private async getGradeSectionProgram(
    gradeLevelCode: string[],
    schoolId: number,
  ): Promise<Requirements['dataForProcessing']> {
    const gradeSectionProgramIdArr =
      await this.prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            grade_level_code: {
              in: gradeLevelCode,
            },
            school_id: schoolId,
          },
        },
        select: {
          grade_section_program_id: true,
          grade_level_offered: {
            select: {
              grade_level_code: true,
            },
          },
        },
      });

    if (!gradeSectionProgramIdArr)
      return {
        tobeCreated: gradeLevelCode,
        toBeCreatedRequirements: [],
      };

    const foundGradeLevels = new Map<string, number>(); // grade_level_code -> id

    for (const g of gradeSectionProgramIdArr) {
      foundGradeLevels.set(
        g.grade_level_offered.grade_level_code,
        g.grade_section_program_id,
      );
    }

    const tobeCreated: string[] = [];
    const toBeCreatedRequirements: number[] = [];

    for (const code of gradeLevelCode) {
      if (foundGradeLevels.has(code))
        toBeCreatedRequirements.push(foundGradeLevels.get(code)!);
      else tobeCreated.push(code);
    }

    return {
      tobeCreated,
      toBeCreatedRequirements,
    };
  }

  private async processToBeCreatedRequirements(
    gradeSectionProgramIdArr: number[],
    data: Requirements['receivedData'],
  ): Promise<Requirements['finalData'][]> {
    const requirements: Requirements['finalData'][] =
      gradeSectionProgramIdArr.map((g) => {
        return {
          grade_section_program_id: g,
          name: data.requirements.name,
          requirement_type: data.requirements.type as $Enums.requirement_type,
          accepted_data_type: data.requirements
            .dataType as $Enums.accepted_data_type,
          is_required: data.requirements.isRequired,
          description: data.requirements.description,
        };
      });

    return requirements;
  }

  private async retrieveProgramId(): Promise<number> {
    const programId = await this.prisma.academic_program.findFirst({
      where: {
        program: 'General',
      },
      select: {
        program_id: true,
      },
    });

    return programId?.program_id ?? 0;
  }

  private async retrieveGradeLevelOfferedIdArr(
    gradeLevelCode: string[],
    schoolId: number,
  ): Promise<number[]> {
    const gradeLevelOfferedIdArr =
      await this.prisma.grade_level_offered.findMany({
        where: {
          grade_level_code: {
            in: gradeLevelCode,
          },
          school_id: schoolId,
        },
        select: {
          grade_level_offered_id: true,
        },
      });

    return gradeLevelOfferedIdArr.map((g) => g.grade_level_offered_id);
  }

  private async retrieveGradeSectionProgramIdArr(
    sectionId: number[],
  ): Promise<number[]> {
    const gradeSectionProgramIdArr = await this.prisma.grade_section.findMany({
      where: {
        grade_section_program_id: {
          in: sectionId,
        },
      },
      select: {
        grade_section_program: {
          select: {
            grade_section_program_id: true,
          },
        },
      },
    });

    return gradeSectionProgramIdArr.map(
      (g) => g.grade_section_program.grade_section_program_id,
    );
  }

  private async createGradeSectionProgram(
    gradeLevelOfferedArr: number[],
    programId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<number[]> {
    const mapFinalData = gradeLevelOfferedArr.map((g) => ({
      grade_level_offered_id: g,
      program_id: programId,
    }));

    await prisma.grade_section_program.createMany({
      data: mapFinalData,
    });

    const gradeSectionProgramIdArr =
      await prisma.grade_section_program.findMany({
        where: {
          grade_level_offered_id: {
            in: gradeLevelOfferedArr,
          },
          program_id: programId,
        },
        select: {
          grade_section_program_id: true,
        },
      });

    return gradeSectionProgramIdArr.map((g) => g.grade_section_program_id);
  }

  private async createRequirements(
    finalData: Requirements['finalData'][],
  ): Promise<boolean> {
    const result = await this.prisma.enrollment_requirement.createMany({
      data: finalData,
    });

    return result ? true : false;
  }
}
