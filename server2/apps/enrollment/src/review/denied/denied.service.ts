import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeniedService {
  constructor(private readonly prisma: PrismaService) {}

  // student name
  // date denied
  // reviwed by
  // reasons
  //  - requirement name
  //  - reason
  async getDeniedEnrollmentsBySchool(schoolId: number) {
    const deniedApplications =
      await this.prisma.enrollment_application.findMany({
        where: {
          status: 'denied',
          grade_level_offered: {
            school_id: schoolId,
          },
        },
        select: {
          application_id: true,
          update_datetime: true,
          remarks: true,
          student: {
            select: {
              user_student_enroller_idTouser: {
                select: {
                  first_name: true,
                  last_name: true,
                  middle_name: true,
                  suffix: true,
                },
              },
            },
          },
        },
      });

    const enrollmentDetails = deniedApplications.map(async (application) => {
      const attachments = await this.prisma.application_attachment.findMany({
        where: {
          application_id: application.application_id,
        },
        orderBy: {
          update_datetime: 'desc',
        },
        select: {
          remarks: true,
          user: {
            select: {
              first_name: true,
              last_name: true,
              middle_name: true,
              suffix: true,
            },
          },
          enrollment_requirement: {
            select: {
              name: true,
            },
          },
        },
      });

      const studentUser = application.student.user_student_enroller_idTouser;
      const latestReviewer = attachments[0]?.user;

      return {
        student: {
          firstName: studentUser.first_name,
          lastName: studentUser.last_name,
          middleName: studentUser.middle_name,
          suffix: studentUser.suffix,
        },
        dateDenied: application.update_datetime,
        // Use the most recent reviewer (top of ordered attachments)
        reviewer: latestReviewer
          ? {
              firstName: latestReviewer.first_name,
              lastName: latestReviewer.last_name,
              middleName: latestReviewer.middle_name,
              suffix: latestReviewer.suffix,
            }
          : null,
        // Extract each denial reason with the associated requirement
        reasons: attachments.map((attachment) => ({
          requirementName: attachment.enrollment_requirement.name,
          reason: attachment.remarks,
        })),
      };
    });

    return Promise.all(enrollmentDetails);
  }
}
