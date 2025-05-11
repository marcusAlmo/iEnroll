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
    schoolId: number,
    data: Requirements['receivedData'],
  ): Promise<MicroserviceUtility['returnValue']> {
    console.log('receiveddata: ', data);

    if (data.gradeSectionProgramId == 0) {
      const programStringArr: string[] = data.requirements.map((d) => {
        return d.program;
      });

      const programIds: string[] = await this.getProgramId(programStringArr);
    }

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
      await this.prisma.grade_level_offered.findMany({
        where: {
          grade_level_offered_id: {
            in: gradeLevelOfferedIds,
          },
          is_active: true,
        },
        select: {
          grade_level_offered_id: true,
          grade_section_program: {
            select: {
              grade_section_program_id: true,
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
          },
          grade_level_code: true,
          grade_level: {
            select: {
              grade_level: true,
            },
          },
        },
        orderBy: {
          grade_level: {
            order_position: 'asc',
          },
        },
      });

    if (!requirements || requirements.length == 0) return [];

    return requirements;
  }

  private async processRetrieveData(
    data: Requirements['retrieveRequirementsRaw'],
  ): Promise<Requirements['processedRequirements']> {
    const results: Requirements['processedRequirements'] = [];
    console.log('data: ', data);

    for (const gradeLevelOffered of data) {
      const {
        grade_level_offered_id,
        grade_level_code,
        grade_section_program,
      } = gradeLevelOffered;
      const { grade_level } = gradeLevelOffered.grade_level;

      const requirements: Array<{
        requirementId: number;
        name: string;
        type: string;
        dataType: string;
        isRequired: boolean | null;
        description: string | null;
      }> = [];

      const gradeSectionProgramIds = new Set<number>();

      // Process all grade section programs (even if they have no requirements)
      for (const program of grade_section_program) {
        gradeSectionProgramIds.add(program.grade_section_program_id);

        // Only process requirements if they exist
        if (
          program.enrollment_requirement &&
          program.enrollment_requirement.length > 0
        ) {
          requirements.push(
            ...program.enrollment_requirement.map((req) => ({
              requirementId: req.requirement_id,
              name: req.name,
              type: req.requirement_type,
              dataType: req.accepted_data_type,
              isRequired: req.is_required,
              description: req.description,
            })),
          );
        }
      }

      // Always include the grade level, even if there are no requirements
      results.push({
        gradeLevelOfferedId: grade_level_offered_id,
        gradeLevel: grade_level,
        gradeLevelCode: grade_level_code,
        gradeSectionProgramId:
          gradeSectionProgramIds.size > 0
            ? Array.from(gradeSectionProgramIds)[0]
            : 0,
        requirements, // Will be empty array if no requirements exist
      });
    }

    return results;
  }

  // for creating new
  private async getProgramId(programs: string[]): Promise<number[]> {
    const result = await this.prisma.academic_program.findMany({
      where: {
        program: {
          in: programs,
        },
      },
      select: {
        program_id: true,
      },
    });

    return result ? result.map((item) => item.program_id) : [];
  }

  private async createGradeSectionProgram(
    schoolId: number,
    gradeLevelOfferedId: number,
    name: string,
    adviser: string,
    admissionSlot: number,
    maxApplicationSlot: number,
  ): Promise<boolean> {
    const result = await this.prisma.grade_section_program.create({
      data: {
        grade_level_offered_id: gradeLevelOfferedId,
        name: name,
        adviser: adviser,
        admission_slot: admissionSlot,
        max_application_slot: maxApplicationSlot,
      },
    });

    return result ? true : false;
  }

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
