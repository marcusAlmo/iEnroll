import {
  RequirementTextDto,
  RequirementDocumentDto,
} from '@lib/dtos/src/enrollment/v1/enroll.dto';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { $Enums } from '@prisma/client';

@Injectable()
export class EnrollService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Add slots for each schedule
  async getSchoolLevelAndScheduleSelection(schoolId: number) {
    const now = new Date();

    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        is_active: true,
        school_id: schoolId,
        grade_level: {
          is_supported: true,
          academic_level: {
            is_supported: true,
          },
        },
      },
      select: {
        grade_level: {
          select: {
            grade_level: true,
            grade_level_code: true,
            academic_level: {
              select: {
                academic_level: true,
                academic_level_code: true,
              },
            },
          },
        },
        grade_section_program: {
          select: {
            grade_section_program_id: true,
            academic_program: {
              select: {
                program: true,
              },
            },
            grade_section: {
              select: {
                grade_section_id: true,
                section_name: true,
                slot: true,
                max_application_slot: true,
              },
            },
          },
        },
        enrollment_schedule: {
          select: {
            start_datetime: true,
            end_datetime: true,
          },
        },
      },
    });

    const grouped = result.reduce(
      (acc, curr) => {
        const academicLevelName =
          curr.grade_level.academic_level.academic_level;
        const academicLevelCode =
          curr.grade_level.academic_level.academic_level_code;
        const gradeLevelName = curr.grade_level.grade_level;
        const gradeLevelCode = curr.grade_level.grade_level_code;
        const gradeSectionPrograms = curr.grade_section_program;

        // Filter valid enrollment schedules
        const filteredSchedules = curr.enrollment_schedule.filter(
          (schedule) => new Date(schedule.end_datetime) >= now,
        );

        // Build section types with sections
        const sectionTypes = gradeSectionPrograms.map((program) => ({
          id: program.grade_section_program_id,
          type: program.academic_program.program,
          sections: program.grade_section.map((section) => ({
            id: section.grade_section_id,
            name: section.section_name,
            slot: section.slot,
            max_slot: section.max_application_slot,
          })),
        }));

        if (!acc[academicLevelName]) {
          acc[academicLevelName] = {
            name: academicLevelName,
            code: academicLevelCode,
            gradeLevels: [],
          };
        }

        acc[academicLevelName].gradeLevels.push({
          name: gradeLevelName,
          code: gradeLevelCode,
          schedule: filteredSchedules.length > 0 ? filteredSchedules : null,
          note:
            filteredSchedules.length === 0
              ? 'All enrollment schedules have passed.'
              : undefined,
          gradeSectionType: sectionTypes,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          code: string;
          gradeLevels: {
            name: string;
            code: string;
            schedule: { start_datetime: Date; end_datetime: Date }[] | null;
            note?: string;
            gradeSectionType: {
              id: number;
              type: string;
              sections: {
                id: number;
                name: string;
                slot: number;
                max_slot: number;
              }[];
            }[];
          }[];
        }
      >,
    );

    return Object.values(grouped);
  }

  async getAllGradeSectionTypeRequirements(gradeSectionProgramId: number) {
    const result = await this.prisma.enrollment_requirement.findMany({
      where: {
        grade_section_program_id: gradeSectionProgramId,
      },
      select: {
        requirement_id: true,
        name: true,
        requirement_type: true,
        accepted_data_type: true,
        is_required: true,
      },
    });

    return result.map(
      ({
        requirement_id,
        name,
        requirement_type,
        accepted_data_type,
        is_required,
      }) => ({
        requirementId: requirement_id,
        name,
        requirement_type,
        acceptedDataTypes: accepted_data_type,
        isRequired: is_required,
      }),
    );
  }

  async getPaymentMethodDetails(gradeSectionProgramId: number) {
    const result = await this.prisma.enrollment_fee.findMany({
      where: {
        grade_section_program_id: gradeSectionProgramId,
        grade_section_program: {
          grade_level_offered: {
            school: {
              school_payment_option: {
                some: {
                  is_available: true,
                },
              },
            },
          },
        },
      },
      select: {
        name: true,
        amount: true,
        description: true,
        due_date: true,
        grade_section_program: {
          select: {
            grade_level_offered: {
              select: {
                school: {
                  select: {
                    school_payment_option: {
                      select: {
                        payment_option_id: true,
                        provider: true,
                        account_name: true,
                        account_number: true,
                        instruction: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      fees: result.map(
        ({
          name,
          amount,
          description,
          due_date,
          grade_section_program: {
            grade_level_offered: {
              school: { school_payment_option },
            },
          },
        }) => ({
          name,
          amount: amount.toNumber(),
          description,
          dueDate: due_date,
          paymentOptions: school_payment_option.map((p) => ({
            id: p.payment_option_id,
            accountName: p.account_name,
            accountNumber: p.account_number,
            provider: p.provider,
            instruction: p.instruction,
          })),
        }),
      ),
    };
  }

  async submitPayment(payload: {
    fileId: number;
    paymentOptionId: number;
    studentId: number;
  }) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.enrollment_fee_payment.create({
          data: {
            student_id: payload.studentId,
            file_id: payload.fileId,
            payment_option_id: payload.paymentOptionId,
          },
        });
      });
    } catch (error: any) {
      throw new RpcException(error.message as string);
    }
  }

  async submitRequirements(
    payload: {
      applicationId: number;
      requirementId: number;
      textContent: string;
      type: $Enums.attachment_type;
      fileId?: number;
    }[],
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.application_attachment.createMany({
        data: payload.map((p) => ({
          application_id: p.applicationId,
          requirement_id: p.requirementId,
          text_content: p.textContent,
          type: p.type,
          file_id: p.fileId,
          status: $Enums.attachment_status.pending,
        })),
      });
    });
  }
}
