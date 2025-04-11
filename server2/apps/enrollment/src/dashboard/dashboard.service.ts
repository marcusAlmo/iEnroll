import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentStatus } from './enums/enrollment-status.enum';
// import { $Enums } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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
          user_student_student_idTouser: {
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
        schoolId: result.user_student_student_idTouser.school.school_id,
        schoolName: result.user_student_student_idTouser.school.name,
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
            proof_of_payment_path: true,
          },
        },
      },
    });
    if (!result) {
      return EnrollmentStatus.NOT_FOUND;
    }
    if (!result.enrollment_application) {
      return EnrollmentStatus.NOT_ENROLLED;
    }

    // if status values $Enums.application_status.accepted, program and section becomes not null.
    return {
      enrollmentStatus: result.enrollment_application?.status,
      gradeLevel:
        result.enrollment_application?.grade_level_offered.grade_level
          .grade_level,
      section:
        result.enrollment_application.student_enrollment?.grade_section
          .section_name,
      program:
        result.enrollment_application.student_enrollment?.grade_section
          .grade_section_program.academic_program.program,
      isPaid: Boolean(result.enrollment_fee_payment),
    };
  }
}
