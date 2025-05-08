import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EnrolledService {
  constructor(private readonly prisma: PrismaService) {}

  // Shared function to fetch student enrollments with relations
  private async fetchStudentEnrollments(filter: any) {
    return this.prisma.student_enrollment.findMany({
      where: filter,
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
  }

  async getAllGradeLevelsBySchool(schoolId: number) {
    if (schoolId === undefined)
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_INVALID_SCHOOL_ID',
      });

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

    return refined;
  }

  private mapStudentEnrollmentData = (data: any) => {
    return {
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
    };
  };

  async getAllStudentsEnrolledBySection(sectionId: number, keyword?: string) {
    const result = await this.fetchStudentEnrollments({
      grade_section_id: sectionId,
    });
    return this.filterAndSortStudents(
      result.filter(
        (entry): entry is typeof entry & { enrollment_datetime: Date } =>
          entry.enrollment_datetime !== null,
      ),
      keyword,
    );
  }

  async getAllStudentsEnrolledByGradeLevel(gradeLevelId: number) {
    const result = await this.fetchStudentEnrollments({
      grade_section: {
        grade_section_program: {
          grade_level_offered_id: gradeLevelId,
        },
      },
    });

    return result.map(this.mapStudentEnrollmentData);
  }

  async getAllStudentsEnrolledBySchool(schoolId: number) {
    const result = await this.fetchStudentEnrollments({
      grade_section: {
        grade_section_program: {
          grade_level_offered: {
            school_id: schoolId,
          },
        },
      },
    });

    return result.map(this.mapStudentEnrollmentData);
  }

  async getAllStudentsEnrolledFiltered(
    filter: { sectionId?: number; gradeLevelId?: number; schoolId?: number },
    keyword?: string,
  ) {
    const result = await this.fetchStudentEnrollments({
      AND: [
        filter.sectionId ? { grade_section_id: filter.sectionId } : undefined,
        filter.gradeLevelId
          ? {
              grade_section: {
                grade_section_program: {
                  grade_level_offered_id: filter.gradeLevelId,
                },
              },
            }
          : undefined,
        filter.schoolId
          ? {
              grade_section: {
                grade_section_program: {
                  grade_level_offered: {
                    school_id: filter.schoolId,
                  },
                },
              },
            }
          : undefined,
      ].filter(Boolean),
    });

    return this.filterAndSortStudents(
      result.filter(
        (entry): entry is typeof entry & { enrollment_datetime: Date } =>
          entry.enrollment_datetime !== null,
      ),
      keyword,
    );
  }

  private filterAndSortStudents(
    result: {
      enrollment_application: {
        student: {
          user_student_enroller_idTouser: {
            user_id: number;
            first_name: string;
            last_name: string;
            middle_name: string | null;
            suffix: string | null;
          };
        };
        status: string;
      };
      enrollment_datetime: Date;
      grade_section: {
        section_name: string;
        grade_section_program: {
          grade_level_offered: {
            grade_level: {
              grade_level: string;
            };
          };
        };
      };
    }[],
    keyword?: string,
  ) {
    const keywordTokens = keyword
      ? keyword.toLowerCase().split(/\s+/).filter(Boolean)
      : [];

    const scored = result.map((data) => {
      const user =
        data.enrollment_application.student.user_student_enroller_idTouser;
      const fullName =
        `${user.first_name ?? ''} ${user.middle_name ?? ''} ${user.last_name ?? ''} ${user.suffix ?? ''}`
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      let score = 0; // Initialize score variable
      for (const token of keywordTokens) {
        if (user.user_id.toString().includes(token)) score += 2;
        if (fullName.includes(token)) score += 1;
      }

      return {
        studentId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        suffix: user.suffix,
        enrollmentStatus: data.enrollment_application.status,
        enrollmentDate: data.enrollment_datetime,
        gradeLevel:
          data.grade_section.grade_section_program.grade_level_offered
            .grade_level.grade_level,
        sectionName: data.grade_section.section_name,
        _score: score,
      };
    });

    return scored
      .filter((entry) => (keyword ? entry._score > 0 : true))
      .sort((a, b) =>
        b._score !== a._score
          ? b._score - a._score
          : a.lastName.localeCompare(b.lastName),
      );
  }
}
