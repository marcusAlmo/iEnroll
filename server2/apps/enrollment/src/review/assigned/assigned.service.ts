import { FileCommonService } from '@lib/file-common/file-common.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { $Enums, Prisma } from '@prisma/client';

@Injectable()
export class AssignedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileCommonService: FileCommonService,
  ) {}

  async getAllGradeLevelsBySchool(schoolId: number) {
    const result = await this.prisma.grade_level_offered.findMany({
      where: {
        is_active: true,
        school_id: schoolId,
      },
      select: {
        grade_level_offered_id: true,
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

    return result.map((data) => ({
      gradeId: data.grade_level_offered_id,
      gradeName: data.grade_level.grade_level,
    }));
  }
  async getAllSectionsByGradeLevel(gradeLevelId: number) {
    const result = await this.prisma.grade_section.findMany({
      where: {
        grade_section_program: {
          grade_level_offered_id: gradeLevelId,
        },
      },
      select: {
        grade_section_program: {
          select: {
            grade_section_program_id: true,
            academic_program: {
              select: {
                program: true,
              },
            },
          },
        },
        grade_section_id: true,
        section_name: true,
      },
    });

    const refined = result.map((data) => ({
      gradeSectionProgramId:
        data.grade_section_program.grade_section_program_id,
      programName: data.grade_section_program.academic_program.program,
      sectionId: data.grade_section_id,
      sectionName: data.section_name,
    }));

    // // TODO: You can dynamically check if theres unassigned students in a particular grade level
    // refined.push({
    //   // section id becomes that grade level id
    //   sectionId: gradeLevelId,
    //   sectionName: 'Unassigned',
    // });

    return refined;
  }

  async getAllStudentsAssigned(sectionId: number) {
    const result = await this.prisma.student_enrollment.findMany({
      where: {
        grade_section_id: sectionId,
        // enrollment_application: {
        //   status: {
        //     in: ['accepted', 'pending'],
        //   },
        // },
      },
      select: {
        enrollment_application: {
          select: {
            status: true,
            student: {
              select: {
                // since enroller is the student itself
                user_student_enroller_idTouser: {
                  select: {
                    first_name: true,
                    last_name: true,
                    middle_name: true,
                    suffix: true,
                    user_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result.map((data) => ({
      studentId:
        data.enrollment_application.student.user_student_enroller_idTouser
          .user_id,
      firstName:
        data.enrollment_application.student.user_student_enroller_idTouser
          .first_name,
      lastName:
        data.enrollment_application.student.user_student_enroller_idTouser
          .last_name,
      middleName:
        data.enrollment_application.student.user_student_enroller_idTouser
          .middle_name,
      suffix:
        data.enrollment_application.student.user_student_enroller_idTouser
          .suffix,
      enrollmentStatus: data.enrollment_application.status,
    }));
  }

  // Since enrollment application now linked to grade_section_program_id, it will now be used
  async getAllStudentsUnassigned(gradeSectionProgramId: number | number[]) {
    if (
      typeof gradeSectionProgramId !== 'number' ||
      !Array.isArray(gradeSectionProgramId)
    )
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_GRADE_SECTION_PROGRAM_ID_INVALID_TYPE',
      });

    if (Array.isArray(gradeSectionProgramId)) {
      // Ensure all elements in the array are numbers
      if (!gradeSectionProgramId.every((id) => typeof id === 'number')) {
        throw new RpcException({
          statusCode: 400,
          message: 'ERR_GRADE_SECTION_PROGRAM_ID_ARRAY_CONTAINS_NON_NUMBER',
        });
      }
    }

    const result = await this.prisma.enrollment_application.findMany({
      where: {
        grade_section_program_id:
          typeof gradeSectionProgramId === 'number'
            ? gradeSectionProgramId
            : {
                in: gradeSectionProgramId as number[],
              },
        student_enrollment: null,
        // status: {
        //   in: ['accepted', 'pending'],
        // },
      },
      select: {
        status: true,
        student: {
          select: {
            // since enroller is the student itself
            user_student_enroller_idTouser: {
              select: {
                first_name: true,
                last_name: true,
                middle_name: true,
                suffix: true,
                user_id: true,
              },
            },
          },
        },
      },
    });

    return result.map((data) => ({
      studentId: data.student.user_student_enroller_idTouser.user_id,
      firstName: data.student.user_student_enroller_idTouser.first_name,
      lastName: data.student.user_student_enroller_idTouser.last_name,
      middleName: data.student.user_student_enroller_idTouser.middle_name,
      suffix: data.student.user_student_enroller_idTouser.suffix,
      enrollmentStatus: data.status,
    }));
  }
  // async getAllStudentsUnassigned(gradeLevelId: number) {
  //   const result = await this.prisma.enrollment_application.findMany({
  //     where: {
  //       grade_level_offered_id: gradeLevelId,
  //       student_enrollment: null,
  //       // status: {
  //       //   in: ['accepted', 'pending'],
  //       // },
  //     },
  //     select: {
  //       status: true,
  //       student: {
  //         select: {
  //           // since enroller is the student itself
  //           user_student_enroller_idTouser: {
  //             select: {
  //               first_name: true,
  //               last_name: true,
  //               middle_name: true,
  //               suffix: true,
  //               user_id: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return result.map((data) => ({
  //     studentId: data.student.user_student_enroller_idTouser.user_id,
  //     firstName: data.student.user_student_enroller_idTouser.first_name,
  //     lastName: data.student.user_student_enroller_idTouser.last_name,
  //     middleName: data.student.user_student_enroller_idTouser.middle_name,
  //     suffix: data.student.user_student_enroller_idTouser.suffix,
  //     enrollmentStatus: data.status,
  //   }));
  // }

  async getAllRequiermentsByStudent(studentId: number) {
    const result = await this.prisma.application_attachment.findMany({
      where: {
        enrollment_application: {
          student: {
            //? Since the enroller is the student her/himself
            enroller_id: studentId,
          },
        },
      },
      select: {
        //? Primary identifiers, as composite key
        application_id: true,
        requirement_id: true,

        status: true,
        attachment_type: true,
        text_content: true,
        remarks: true,
        enrollment_requirement: {
          select: {
            name: true,
          },
        },
        file: {
          select: {
            name: true,
            uuid: true,
          },
        },
      },
    });

    return result.map((data) => {
      return {
        // ? Attachment idenfifier as composite key
        applicationId: data.application_id,
        requirementId: data.requirement_id,

        requirementName: data.enrollment_requirement.name,
        requirementType: data.attachment_type,
        requirementStatus: data.status,

        remarks: data.remarks,

        // requirementType = image or document
        fileUrl: data.file?.uuid
          ? this.fileCommonService.formatFileUrl(String(data.file.uuid))
          : null,
        fileName: data.file?.name ?? null,

        // requirementType = text
        //? text content
        userInput: data.text_content,
      };
    });
  }

  async approveOrDenyAttachment(
    action: 'deny' | 'approve',
    applicationId: number,
    requirementId: number,
    reviewerId: number,
    remarks?: string,
  ) {
    let status: $Enums.attachment_status;

    switch (action) {
      case 'approve':
        status = $Enums.attachment_status.accepted;
        break;
      case 'deny':
        status = $Enums.attachment_status.invalid;
        break;
      default:
        status = $Enums.attachment_status.pending;
        break;
    }

    try {
      const result = await this.prisma.application_attachment.update({
        where: {
          requirement_id_application_id: {
            requirement_id: requirementId,
            application_id: applicationId,
          },
        },
        data: {
          status,
          reviewer_id: reviewerId,
          remarks,
          review_datetime: new Date(),
        },
      });

      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new RpcException({
          statusCode: 404,
          message: 'ERR_REQUIREMENT_NOT_FOUND',
        });
      }
      throw error;
    }
  }

  async updateEnrollmentStatus(
    status: 'accepted' | 'denied' | 'invalid',
    studentId: number,
  ) {
    const enrollmentApplication =
      await this.prisma.enrollment_application.findFirst({
        where: {
          student: {
            enroller_id: studentId,
          },
        },
        select: {
          application_id: true,
          application_attachment: {
            select: {
              status: true,
            },
          },
        },
      });

    if (!enrollmentApplication) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_APPLICATION_NOT_FOUND',
      });
    }

    if (!enrollmentApplication.application_attachment.length) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_NO_REQUIREMENTS_FOUND',
      });
    }

    let parsedStatus: $Enums.application_status;

    switch (status) {
      case 'accepted': {
        parsedStatus = $Enums.application_status.accepted;
        const allAccepted = enrollmentApplication.application_attachment.every(
          (attachment) =>
            attachment.status === $Enums.application_status.accepted,
        );

        if (!allAccepted) {
          throw new RpcException({
            statusCode: 400,
            message: 'ERR_ACCEPTED_REQUIRES_ALL_ACCEPTED',
          });
        }

        break;
      }

      case 'invalid': {
        parsedStatus = $Enums.application_status.invalid;

        let hasInvalid = false;
        let hasNonInvalid = false;

        for (const attachment of enrollmentApplication.application_attachment) {
          if (attachment.status === $Enums.application_status.invalid) {
            hasInvalid = true;
          } else {
            hasNonInvalid = true;
          }

          if (hasInvalid && hasNonInvalid) break;
        }

        if (!hasInvalid || !hasNonInvalid) {
          throw new RpcException({
            statusCode: 400,
            message: 'ERR_INVALID_REQUIRES_PARTIAL_INVALID_ONLY',
          });
        }

        break;
      }

      case 'denied': {
        parsedStatus = $Enums.application_status.denied;
        const allInvalid = enrollmentApplication.application_attachment.every(
          (attachment) =>
            attachment.status === $Enums.application_status.invalid,
        );

        if (!allInvalid) {
          throw new RpcException({
            statusCode: 400,
            message: 'ERR_DENIED_REQUIRES_ALL_INVALID',
          });
        }

        break;
      }
      default:
        parsedStatus = $Enums.application_status.pending;
    }

    try {
      await this.prisma.enrollment_application.update({
        where: {
          application_id: enrollmentApplication.application_id,
        },
        data: {
          status: parsedStatus,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_FAILED_TO_UPDATE_ENROLLMENT_STATUS',
      });
    }
  }

  async enrollStudent(
    studentId: number,
    sectionId: number,
    approverId: number,
    enrollmentRemarks?: string,
  ) {
    const [enrollmentApplication, sectionExists, approverExists] =
      await this.prisma.$transaction([
        this.prisma.enrollment_application.findFirst({
          where: {
            student: {
              enroller_id: studentId,
            },
          },
          select: {
            application_id: true,
            status: true,
            student_enrollment: {
              select: {
                enrollment_id: true,
              },
            },
          },
        }),
        this.prisma.grade_section.findUnique({
          where: { grade_section_id: sectionId },
          select: { grade_section_id: true },
        }),
        this.prisma.user.findFirst({
          where: {
            user_id: approverId,
          },
          select: {
            user_id: true,
          },
        }),
      ]);

    if (!enrollmentApplication) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_APPLICATION_NOT_FOUND',
      });
    }

    if (!sectionExists) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_SECTION_NOT_FOUND',
      });
    }

    if (!approverExists) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_APPROVER_NOT_FOUND',
      });
    }

    if (enrollmentApplication.status !== $Enums.application_status.accepted) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_CANNOT_ENROLL_IF_NOT_ACCEPTED',
      });
    }

    if (enrollmentApplication.student_enrollment) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_CANNOT_RE_ENROLL',
      });
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.student_enrollment.create({
          data: {
            enrollment_id: enrollmentApplication.application_id,
            grade_section_id: sectionId,
            approver_id: approverId,
            enrollment_remarks: enrollmentRemarks,
          },
        });

        await tx.student.update({
          where: {
            student_id: studentId,
          },
          data: {
            has_enrolled: true,
          },
        });
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_FAILED_TO_CREATE_ENROLLMENT',
      });
    }
  }

  async reassignStudentIntoDifferentSection(
    studentId: number,
    sectionId: number,
  ) {
    const [studentEnrollment, sectionExists] = await this.prisma.$transaction([
      this.prisma.student_enrollment.findFirst({
        where: {
          enrollment_application: {
            student: { enroller_id: studentId },
          },
        },
        select: {
          grade_section_id: true,
          enrollment_id: true,
        },
      }),
      this.prisma.grade_section.findUnique({
        where: { grade_section_id: sectionId },
        select: { grade_section_id: true },
      }),
    ]);

    if (!studentEnrollment) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_APPLICATION_NOT_FOUND',
      });
    }

    if (!sectionExists) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_SECTION_NOT_FOUND',
      });
    }

    if (sectionId === studentEnrollment.grade_section_id) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_CANNOT_REASSIGN_WITH_SAME_SECTION',
      });
    }

    try {
      await this.prisma.student_enrollment.update({
        where: {
          enrollment_id: studentEnrollment.enrollment_id,
        },
        data: {
          grade_section_id: sectionId,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_FAILED_TO_UPDATE_SECTION',
      });
    }
  }
}
