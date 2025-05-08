import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { $Enums, attachment_type } from '@prisma/client';

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
    const result = await this.prisma.academic_level.findMany({
      where: {
        is_supported: true,
        grade_level: {
          some: {
            grade_level_offered: {
              some: {
                school_id: schoolId,
                is_active: true,
              },
            },
          },
        },
      },
      select: {
        academic_level: true,
        academic_level_code: true,
      },
    });
    return result.map((level) => ({
      academicLeveLCode: level.academic_level_code,
      academicLevel: level.academic_level,
    }));
  }

  async getGradeLevelsByAcademicLevel(
    academicLevelCode: string,
    schoolId: number,
  ) {
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        grade_level: {
          academic_level_code: academicLevelCode,
        },
      },
      select: {
        can_choose_section: true,
        grade_level: {
          select: {
            grade_level_code: true,
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

    return result.map((data) => ({
      gradeLevelCode: data.grade_level.grade_level_code,
      gradeLevel: data.grade_level.grade_level,
      canChooseSection: data.can_choose_section,
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
        is_paused: false,
        aux_schedule_slot: {
          is_closed: false,
        },
      },
      select: {
        schedule_id: true,
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
      scheduleId: data.schedule_id,
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
        programId: +programId,
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
                    additional_fee: true,
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
            additionalFee: p.additional_fee.toNumber(),
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

  async makeStudentEnrollmentApplication(payload: {
    details: {
      studentId: number;
      schoolId: number;
      gradeSectionProgramId: number;
      // Optional, if student has already selected section
      gradeSectionId?: number;
      scheduleId: number;
      remarks?: string;
    };
    requirements: {
      requirementId: number;
      textContent?: string;
      attachmentType: attachment_type;
      fileId?: number;
    }[];
    payment: {
      fileId: number;
      paymentOptionId: number;
    };
  }) {
    const { details, requirements, payment } = payload;

    // Step 1 - Ensure the student exists and hasn't already applied or paid.
    const student = await this.prisma.student.findUnique({
      where: { student_id: details.studentId },
      select: {
        student_id: true,
        enrollment_application: {
          select: { application_id: true },
        },
        enrollment_fee_payment: {
          select: { student_id: true },
        },
      },
    });

    if (!student) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_STUDENT_NOT_FOUND',
      });
    }

    // Step 2 - Check if student has already applied.
    if (student.enrollment_application) {
      throw new RpcException({
        statusCode: 409,
        message: 'ERR_ALREADY_APPLIED',
      });
    }

    // Step 3 - Check if student has already made a payment.
    if (student.enrollment_fee_payment) {
      throw new RpcException({
        statusCode: 409,
        message: 'ERR_ALREADY_PAID',
      });
    }

    // Step 4 & 5 - Fetch schedule and its grade level in one query.

    const schedule = await this.prisma.aux_schedule_slot.findFirst({
      where: {
        schedule_id: details.scheduleId,
        grade_level_offered: {
          school_id: details.schoolId,
          grade_section_program: {
            some: {
              grade_section_program_id: details.gradeSectionProgramId,
              // program_id: details.gradeSectionProgramId,
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_SCHEDULE_OR_GRADE_LEVEL_NOT_FOUND',
      });
    }

    // Step 6 - Check for available slots.
    if (schedule.application_slot_left === 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_SCHEDULE_SLOT_FULL',
      });
    }

    // Step 7 - Check if schedule is closed.
    if (schedule.is_closed) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_SCHEDULE_ALREADY_CLOSED',
      });
    }

    // Step 8 - Validate all file IDs exist.
    const fileIds = Array.from(
      new Set([
        ...requirements.map((r) => r.fileId).filter(Boolean),
        payment.fileId,
      ]),
    ) as number[];

    const files = await this.prisma.file.findMany({
      where: { file_id: { in: fileIds } },
      select: { file_id: true },
    });

    if (files.length !== fileIds.length) {
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_INVALID_FILE_IDS',
      });
    }

    // Step 9 - Check if payment option is valid and available.
    const paymentOption = await this.prisma.school_payment_option.findFirst({
      where: {
        payment_option_id: payment.paymentOptionId,
        school_id: details.schoolId,
      },
      select: { is_available: true },
    });

    if (!paymentOption) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_PAYMENT_OPTION_NOT_FOUND',
      });
    }

    if (!paymentOption.is_available) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_PAYMENT_OPTION_NOT_AVAILABLE',
      });
    }

    if (details.gradeSectionId) {
      // Extra step - Check if section id exists
      const section = await this.prisma.grade_section.findFirst({
        where: {
          grade_section_id: details.gradeSectionId,
        },
        select: {
          grade_section_id: true,
        },
      });

      if (!section) {
        throw new RpcException({
          statusCode: 404,
          message: 'ERR_SECTION_NOT_FOUND',
        });
      }
    }

    // Step 10 - Perform transactional creation.
    try {
      await this.prisma.$transaction([
        this.prisma.enrollment_fee_payment.create({
          data: {
            student_id: details.studentId,
            file_id: payment.fileId,
            payment_option_id: payment.paymentOptionId,
          },
        }),
        this.prisma.enrollment_application.create({
          data: {
            application_id: details.studentId,
            grade_section_program_id: details.gradeSectionProgramId,
            grade_section_id: details.gradeSectionId,
            schedule_id: details.scheduleId,
            remarks: details.remarks,
            application_attachment: {
              createMany: {
                data: requirements.map((r) => ({
                  requirement_id: r.requirementId,
                  text_content: r.textContent ?? null,
                  attachment_type: r.attachmentType,
                  file_id: r.fileId ?? null,
                  status: 'pending',
                })),
              },
            },
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_ENROLL_APPLICATION_FAILED',
      });
    }
  }
}
