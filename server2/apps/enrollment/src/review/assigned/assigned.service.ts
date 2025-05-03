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
        grade_section_id: true,
        section_name: true,
      },
    });

    const refined = result.map((data) => ({
      sectionId: data.grade_section_id,
      sectionName: data.section_name,
    }));

    // TODO: You can dynamically check if theres unassigned students in a particular grade level
    refined.push({
      // section id becomes that grade level id
      sectionId: gradeLevelId,
      sectionName: 'Unassigned',
    });

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
  async getAllStudentsUnassigned(gradeLevelId: number) {
    const result = await this.prisma.enrollment_application.findMany({
      where: {
        grade_level_offered_id: gradeLevelId,
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
          ? this.fileCommonService.formatFileUrl(data.file.uuid)
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
}
