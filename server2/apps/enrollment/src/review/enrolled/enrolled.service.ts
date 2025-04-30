import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrolledService {
  constructor(private readonly prisma: PrismaService) {}

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

    return result.map((data) => ({
      sectionId: data.grade_section_id,
      sectionName: data.section_name,
    }));
  }

  // name
  // id
  // grade level
  // section
  // status
  // enrollment date
  async getAllStudentsEnrolledBySection(sectionId: number) {
    const result = await this.prisma.student_enrollment.findMany({
      where: {
        grade_section_id: sectionId,
      },
      select: {
        enrollment_datetime: true,
        grade_section: {
          select: {
            section_name: true,
            grade_section_program: {
              select: {
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
        },
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
      enrollmentDate: data.enrollment_datetime,
      gradeLevel:
        data.grade_section.grade_section_program.grade_level_offered.grade_level
          .grade_level,
      sectionName: data.grade_section.section_name,
    }));
  }
}
