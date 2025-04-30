import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentStatus } from './enums/enrollment-status.enum';
import { FileCommonService } from '@lib/file-common/file-common.service';
// import { $Enums } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileCommonService: FileCommonService,
  ) {}

  async getEnrollmentDetails(studentId: number) {
    //   : {
    //     enrollmentId: number;
    //     schoolId: number;
    //     schoolName: string;
    //   }
    {
      const result = await this.prisma.student.findFirst({
        where: {
          student_id: studentId,
        },
        select: {
          enrollment_application: {
            select: {
              application_id: true,
            },
          },
          // Enroller refers to the student themselves.
          // As a result, this version only supports self-enrollment, not enrollment by parents or guardians.
          user_student_enroller_idTouser: {
            select: {
              school: {
                select: {
                  school_id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!result) {
        return null;
      }

      return {
        // TODO: Revise this, the initial design is to have a single enrollment application per student
        //?      And also, application id is refferred to as student id in the initial db design
        enrollmentId:
          result.enrollment_application?.application_id ?? studentId,
        schoolId: result.user_student_enroller_idTouser.school.school_id,
        schoolName: result.user_student_enroller_idTouser.school.name,
      };
    }
  }
  async getEnrollmentStatus(studentId: number) {
    const result = await this.prisma.student.findFirst({
      where: {
        student_id: studentId,
      },
      select: {
        enrollment_application: {
          select: {
            status: true,
            grade_level_offered: {
              select: {
                grade_level: {
                  select: {
                    grade_level: true,
                  },
                },
              },
            },
            student_enrollment: {
              select: {
                grade_section: {
                  select: {
                    section_name: true,
                    grade_section_program: {
                      select: {
                        academic_program: {
                          select: {
                            program: true,
                          },
                        },
                        enrollment_fee: {
                          select: {
                            due_date: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        enrollment_fee_payment: {
          select: {
            file_id: true,
          },
        },
      },
    });
    if (!result) {
      return EnrollmentStatus.NOT_FOUND;
    }
    // if (!result.enrollment_application) {
    //   return EnrollmentStatus.NOT_ENROLLED;
    // }

    // if status values $Enums.application_status.accepted, program and section becomes not null.
    return {
      enrollmentStatus: result.enrollment_application?.status,
      gradeLevel:
        result.enrollment_application?.grade_level_offered.grade_level
          .grade_level,
      section:
        result.enrollment_application?.student_enrollment?.grade_section
          .section_name,
      program:
        result.enrollment_application?.student_enrollment?.grade_section
          .grade_section_program.academic_program.program,
      isPaid: Boolean(result.enrollment_fee_payment),
      //? Since there are many payments, I reduced it to the most latest date
      dueDate:
        result.enrollment_application?.student_enrollment?.grade_section.grade_section_program.enrollment_fee.reduce(
          (latest, current) => {
            return new Date(current.due_date) > new Date(latest.due_date)
              ? current
              : latest;
          },
        ).due_date,
    };
  }

  async getDocumentsForReupload(studentId: number) {
    const result = await this.prisma.application_attachment.findMany({
      where: {
        //? Filters invalid files for reupload
        status: 'invalid',
        enrollment_application: {
          student: {
            enroller_id: studentId,
          },
        },
      },
      select: {
        //? Composite keys, need for future reference
        application_id: true,
        requirement_id: true,

        enrollment_requirement: {
          select: {
            //? Requirement name
            name: true,
          },
        },
      },
    });

    return result.map((data) => ({
      requirementId: data.requirement_id,
      applicationId: data.application_id,
      requirementName: data.enrollment_requirement.name,
    }));
  }

  // School files that can ba downloadable by students
  async getFileDownloadablesByStudent(studentId: number, userSchoolId: number) {
    const currentDate = new Date();
    const result = await this.prisma.school_file.findMany({
      where: {
        school_id: userSchoolId,
        OR: [
          {
            access_type: 'public',
          },
          {
            school_file_access: {
              some: {
                student_id: studentId,
                access_datetime: {
                  lte: currentDate,
                },
                access_end_datetime: {
                  gte: currentDate,
                },
              },
            },
          },
        ],
      },
      select: {
        file: {
          select: {
            name: true,
            uuid: true,
          },
        },
      },
      orderBy: {
        upload_datetime: 'desc',
      },
    });

    return result.map((data) => ({
      fileName: data.file.name,
      fileUrl: this.fileCommonService.formatFileUrl(data.file.uuid),
    }));
  }
}
