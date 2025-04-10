import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentStatus } from './enums/enrollment-status.enum';

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

  // TODO: Finish the program field
  // TODO: Finish the payment status field
  // program
  // year/level
  // payment status or payment due date
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
    return {
      enrollmentStatus: result.enrollment_application?.status,
      program:
        result.enrollment_application?.grade_level_offered.grade_level
          .grade_level,
    };
  }
}
