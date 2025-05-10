import { $Enums } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { Requirements } from './interface/requirements.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { JsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class RequirementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getAllRequirements(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    console.log(schoolId);
    const rawData: Requirements['retrieveRequirementsRaw'] =
      await this.getAllRequirementsRaw(schoolId);

    console.log(rawData);

    const processedData: Requirements['processedRequirements'] =
      await this.processRetrieveData(rawData);

    console.log(processedData);

    return this.microserviceUtility.returnSuccess(processedData);
  }

  public async processReceivedData(
    data: Requirements['receivedData'],
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.createRequirements(data);

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
  private async getSupportedAcademicLevels(
    schoolId: number,
  ): Promise<string[]> {
    // retrieve the academic levels supported by the school
    const supportedAcademicLevels: { supported_acad_level: JsonValue } | null =
      await this.prisma.school.findFirst({
        where: {
          school_id: schoolId,
        },
        select: {
          supported_acad_level: true,
        },
      });

    console.log(supportedAcademicLevels);

    if (!supportedAcademicLevels) return [];

    return supportedAcademicLevels.supported_acad_level as string[];
  }

  private async getAllGradeLevelOfferedId(schoolId: number): Promise<number[]> {
    const academicLevels: string[] =
      await this.getSupportedAcademicLevels(schoolId);

    const gradeLevelOfferedIds: { grade_level_offered_id: number }[] =
      await this.prisma.grade_level_offered.findMany({
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
          grade_level_offered_id: true,
        },
      });

    if (!gradeLevelOfferedIds) return [];

    return gradeLevelOfferedIds.map((item) => item.grade_level_offered_id);
  }

  private async getAllRequirementsRaw(
    schoolId: number,
  ): Promise<Requirements['retrieveRequirementsRaw']> {
    const gradeLevelOfferedIds: number[] =
      await this.getAllGradeLevelOfferedId(schoolId);
    console.log('gradeLevelOfferedIds', gradeLevelOfferedIds);

    const requirements: Requirements['retrieveRequirementsRaw'] =
      await this.prisma.grade_section_program.findMany({
        where: {
          grade_level_offered_id: {
            in: gradeLevelOfferedIds,
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
  private async createRequirements(
    data: Requirements['receivedData'],
  ): Promise<boolean> {
    const result = data.requirements.map((requirement) => {
      return {
        grade_section_program_id: data.gradeSectionProgramId,
        name: requirement.name,
        requirement_type: requirement.type as $Enums.requirement_type,
        accepted_data_type: requirement.dataType as $Enums.accepted_data_type,
        is_required: requirement.isRequired,
        description: requirement.description,
      };
    });

    const finalResult = await this.prisma.enrollment_requirement.createMany({
      data: result,
    });

    return finalResult ? true : false;
  }
}
