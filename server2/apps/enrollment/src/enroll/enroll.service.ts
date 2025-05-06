import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { $Enums } from '@prisma/client';

@Injectable()
export class EnrollService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Add slots for each schedule
  // break down this into
  // all academic levels by school
  // all gradelevel by academic level
  // all schedules by grade level
  // all gradesectiontype by grade level
  // all sections by grade level
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
                max_application_slot: true,
              },
            },
          },
        },
        enrollment_schedule: {
          select: {
            start_datetime: true,
            end_datetime: true,
            aux_schedule_slot: {
              select: {
                application_slot_left: true,
              },
            },
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
          schedule:
            filteredSchedules.length > 0
              ? filteredSchedules.map((f) => ({
                  startDatetime: f.start_datetime,
                  endDatetime: f.end_datetime,
                  slotsLeft: f.aux_schedule_slot?.application_slot_left ?? null,
                }))
              : null,
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
            schedule:
              | {
                  startDatetime: Date;
                  endDatetime: Date;
                  slotsLeft: number | null;
                }[]
              | null;
            note?: string;
            gradeSectionType: {
              id: number;
              type: string;
              sections: {
                id: number;
                name: string;
                max_slot: number;
              }[];
            }[];
          }[];
        }
      >,
    );

    return Object.values(grouped);
  }

  async getAcademicLevelsBySchool(schoolId: number) {
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        is_active: true,
        school_id: schoolId,
        grade_level: {
          academic_level: {
            is_supported: true,
          },
        },
      },
      select: {
        grade_level: {
          select: {
            academic_level: {
              select: {
                academic_level: true,
                academic_level_code: true,
              },
            },
          },
        },
      },
      distinct: ['grade_level_code', 'grade_level_offered_id'],
      // distinct: ['grade_level.academic_level.academic_level_code'],
    });

    return result.map(
      ({
        grade_level: {
          academic_level: { academic_level, academic_level_code },
        },
      }) => ({
        academicLeveLCode: academic_level_code,
        academicLevel: academic_level,
      }),
    );
  }

  async getGradeLevelsByAcademicLevel(academicLevelCode: string) {
    const result = await this.prisma.grade_level.findMany({
      where: {
        academic_level_code: academicLevelCode,
        is_supported: true,
      },
      select: {
        grade_level_code: true,
        grade_level: true,
      },
    });

    return result.map((data) => ({
      gradeLevelCode: data.grade_level_code,
      gradeLevel: data.grade_level,
    }));
  }

  async getSchedulesByGradeLevel(gradeLevelCode: string) {
    const now = new Date();

    const result = await this.prisma.enrollment_schedule.findMany({
      where: {
        end_datetime: {
          gte: now,
        },
        grade_level_offered: {
          grade_level_code: gradeLevelCode,
        },
      },
      select: {
        start_datetime: true,
        end_datetime: true,
        aux_schedule_slot: {
          select: {
            application_slot_left: true,
          },
        },
      },
    });

    return result.map((data) => ({
      dateStart: data.start_datetime,
      dateEnd: data.end_datetime,
      // if slots left is undefined, it still didnt accepting slots.
      slotsLeft: data.aux_schedule_slot?.application_slot_left,
    }));
  }

  async getGradeSectionTypesByGradeLevel(gradeLevelCode: string) {
    const result = await this.prisma.grade_section_program.findMany({
      where: {
        grade_level_offered: {
          grade_level_code: gradeLevelCode,
        },
      },
      select: {
        grade_section_program_id: true,
        academic_program: {
          select: {
            program: true,
          },
        },
      },
    });

    return result.map((data) => ({
      gradeSectionId: data.grade_section_program_id,
      gradeSectionType: data.academic_program.program,
    }));
  }

  async getSectionsByGradeLevel(gradeLevelCode: string) {
    const result = await this.prisma.grade_section.findMany({
      where: {
        grade_section_program: {
          grade_level_offered: {
            grade_level_code: gradeLevelCode,
          },
        },
      },
      select: {
        grade_section_program: {
          select: {
            grade_section_program_id: true,
            academic_program: {
              select: {
                program_id: true,
                program: true,
              },
            },
          },
        },
        grade_section_id: true,
        section_name: true,
        max_application_slot: true,
      },
    });

    const mapped = result.map((data) => ({
      programId: data.grade_section_program.academic_program.program_id,
      programName: data.grade_section_program.academic_program.program,
      gradeSectionProgramId:
        data.grade_section_program.grade_section_program_id,
      gradeSectionId: data.grade_section_id,
      sectionName: data.section_name,
      maxSlot: data.max_application_slot,
    }));

    function groupByKey<T extends Record<string, any>>(
      array: T[],
      key: keyof T,
    ) {
      return array.reduce((acc: Record<string, T[]>, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
      }, {});
    }

    // Restructure to desired output format
    return Object.entries(groupByKey(mapped, 'programId')).map(
      ([programId, sections]) => ({
        programId,
        programName: sections[0].programName,
        gradeSectionProgramId: sections[0].gradeSectionProgramId,
        sections: sections.map(({ gradeSectionId, sectionName, maxSlot }) => ({
          gradeSectionId,
          sectionName,
          maxSlot,
        })),
      }),
    );
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
        requirementType: requirement_type,
        acceptedDataTypes: accepted_data_type,
        isRequired: is_required,
      }),
    );
  }

  async getPaymentMethodDetails(gradeSectionProgramId: number) {
    const enrollmentFees = await this.prisma.enrollment_fee.findMany({
      where: {
        grade_section_program_id: gradeSectionProgramId,
      },
      select: {
        name: true,
        amount: true,
        description: true,
        due_date: true,
      },
    });

    const paymentOptions = await this.prisma.grade_section_program.findFirst({
      where: {
        grade_section_program_id: gradeSectionProgramId,
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
    });

    if (!paymentOptions)
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_PAYMENT_OPTION_NOT_FOUND',
      });

    return {
      fees: enrollmentFees.map(({ name, amount, description, due_date }) => ({
        name,
        amount: amount.toNumber(),
        description,
        dueDate: due_date,
      })),
      paymentOptions:
        paymentOptions?.grade_level_offered.school.school_payment_option.map(
          (p) => ({
            id: p.payment_option_id,
            accountName: p.account_name,
            accountNumber: p.account_number,
            provider: p.provider,
            instruction: p.instruction,
          }),
        ) ?? null,
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
          attachment_type: p.type,
          file_id: p.fileId,
          status: $Enums.attachment_status.pending,
        })),
      });
    });
  }

  async validatePaymentOptionId({
    paymentOptionId,
  }: {
    paymentOptionId: number;
  }) {
    const isPaymentOptionIdExists = Boolean(
      await this.prisma.school_payment_option.findFirst({
        select: { payment_option_id: true },
        where: { payment_option_id: paymentOptionId },
      }),
    );

    return isPaymentOptionIdExists;
  }

  async checkIfStudentIsALreadyPaid({ studentId }: { studentId: number }) {
    const isStudentAlreadyPaid = Boolean(
      await this.prisma.enrollment_fee_payment.findFirst({
        where: {
          student_id: studentId,
        },
      }),
    );

    return isStudentAlreadyPaid;
  }

  async checkIfAllRequirementIdsAreValid({
    requirementIds,
  }: {
    requirementIds: number[];
  }) {
    const found = await this.prisma.enrollment_requirement.findMany({
      where: {
        requirement_id: {
          in: requirementIds,
        },
      },
      select: {
        requirement_id: true,
      },
    });

    const foundIds = new Set(found.map((req) => req.requirement_id));
    return requirementIds.every((id) => foundIds.has(id));
  }
}
