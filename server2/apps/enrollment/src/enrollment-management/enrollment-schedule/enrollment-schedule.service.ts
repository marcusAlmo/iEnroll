import { $Enums } from '@prisma/client';
import { application_status } from '@/services/common/types/enums';
import { SelectionReturn } from './../../../../api-gateway/src/enrollment/enroll/enroll.types';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentSchedule } from './interface/enrollment-schedule.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { DateTimeUtilityService } from '@lib/date-time-utility/date-time-utility.service';

@Injectable()
export class EnrollmentScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getAllGrades(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const gradeLevelRaw: EnrollmentSchedule['gradeLevelRaw'] =
      await this.getGradesInfo(schoolId);

    const processedSchedule: EnrollmentSchedule['processedGradeLevel'] =
      await this.processRawData(gradeLevelRaw, schoolId);

    return this.microserviceUtility.returnSuccess(processedSchedule);
  }

  public async storeData(
    data: EnrollmentSchedule['receivedData'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const processedData: EnrollmentSchedule['preliminaryProccessOutput'] =
      await this.formatDataToStoreSemi(data.schedDate);

    const gradeLevelOfferedIdArr: number[] =
      await this.getAllGradeLevelOfferedId(data.gradeLevelCode, schoolId);

    const finalProcessedData: EnrollmentSchedule['storeData'] =
      await this.finalProcess(
        gradeLevelOfferedIdArr,
        processedData,
        data.canChooseSection,
        data.slotCapacity,
      );

    const result: EnrollmentSchedule['processReturn'] =
      await this.storeDataInDb(finalProcessedData);

    return this.microserviceUtility.returnSuccess(result);
  }

  public async deleteSchedule(
    scheduleId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    await this.prisma.enrollment_schedule.delete({
      where: {
        schedule_id: scheduleId,
      },
    });

    return this.microserviceUtility.returnSuccess({
      message: 'Enrollment schedule deleted successfully',
    });
  }

  public async pauseSchedule(
    scheduleId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    await this.prisma.enrollment_schedule.update({
      where: {
        schedule_id: scheduleId,
      },
      data: {
        is_paused: true,
      },
    });

    return this.microserviceUtility.returnSuccess({
      message: 'Enrollment schedule paused successfully',
    });
  }

  // UTILITY FUNCTIONS

  // for retrieval
  private async collectData(
    schoolId: number,
  ): Promise<EnrollmentSchedule['gradeLevel'][]> {
    const gradeLevels: string[] = await this.getGradeLevels(schoolId);
    const slotCapacity: EnrollmentSchedule['gradeLevelFormat']['schoolCapacity'] =
      await this.getSlotCapacity(schoolId);
    const gradeSections: EnrollmentSchedule['sectionRaw'][] =
      await this.getGradeSection(gradeLevels, schoolId);
    const gradeSchedule: EnrollmentSchedule['scheduleRaw'][] =
      await this.getgradeSchedule(schoolId);


  }

  private async getGradesInfo(
    schoolId: number,
  ): Promise<EnrollmentSchedule['gradeLevelRaw']> {
    const gradesLevelInfo: EnrollmentSchedule['gradeLevelRaw'] =
      await this.prisma.grade_level_offered.findMany({
        where: {
          school_id: schoolId,
        },
        select: {
          grade_level_offered_id: true,
          grade_level_code: true,
          grade_level: {
            select: {
              grade_level: true,
            },
          },
          enrollment_schedule: {
            select: {
              schedule_id: true,
              application_slot: true,
              start_datetime: true,
              end_datetime: true,
              is_paused: true,
              can_choose_section: true,
            },
          },
        },
      });

    if (!gradesLevelInfo) return [];

    return gradesLevelInfo;
  }

  private async getGradeLevels(schoolId: number): Promise<string[]> {
    const data = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
      },
      select: {
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    return data.map((d) => d.grade_level.grade_level);
  }

  private async getGradeSection(
    gradeLevels: string[],
    schoolId: number,
  ): Promise<EnrollmentSchedule['sectionRaw'][]> {
    const data = await this.prisma.grade_section.findMany({
      where: {
        grade_section_program: {
          grade_level_offered: {
            grade_level: {
              grade_level: {
                in: gradeLevels,
              },
            },
            school_id: schoolId,
          },
        },
      },
      select: {
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
        section_name: true,
        admission_slot: true,
        max_application_slot: true,
        student_enrollment: {
          select: {
            enrollment_id: true,
          },
        },
      },
    });

    return data.map((d) => ({
      gradeLevel:
        d.grade_section_program.grade_level_offered.grade_level.grade_level,
      sectionName: d.section_name,
      sectionCapacity: d.admission_slot,
      maximumApplication: d.max_application_slot,
      currentEnrolled: d.student_enrollment.length,
    }));
  }

  private async getgradeSchedule(
    schoolId: number,
  ): Promise<EnrollmentSchedule['scheduleRaw'][]> {
    const data = await this.prisma.enrollment_schedule.findMany({
      where: {
        grade_level_offered: {
          school_id: schoolId,
        },
      },
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
        aux_schedule_slot: {
          select: {
            enrollment_application: {
              where: {
                status: $Enums.application_status.accepted,
              },
              select: {
                application_id: true,
              },
            },
          },
        },
        schedule_id: true,
        start_datetime: true,
        end_datetime: true,
        is_paused: true,
        can_choose_section: true,
      },
    });

    return data.map((d) => ({
      id: d.schedule_id,
      applications: d.aux_schedule_slot
        ? d.aux_schedule_slot.enrollment_application.length
        : 0,
      gradeLevel: d.grade_level_offered.grade_level.grade_level,
      date: DateTimeUtilityService.getDateTOString(d.start_datetime),
      timeRanges: [
        DateTimeUtilityService.getTime12HourFormat(d.start_datetime),
        DateTimeUtilityService.getTime12HourFormat(d.end_datetime),
      ],
      isPaused: d.is_paused,
      allowSectionSelection: d.can_choose_section,
    }));
  }

  private async processRawData(
    gradeLevelRaw: EnrollmentSchedule['gradeLevelRaw'],
    schoolId: number,
  ) {
    return gradeLevelRaw.map((g) => {
      return {
        gradeLevelOfferedId: g.grade_level_offered_id,
        gradeLevelCode: g.grade_level_code,
        gradeLevel: g.grade_level.grade_level,
        enrollmentSchedule: g.enrollment_schedule.map((s) => ({
          scheduleId: s.schedule_id,
          applicationSlot: s.application_slot,
          startDatetime: s.start_datetime,
          endDatetime: s.end_datetime,
          isPaused: s.is_paused,
          canChooseSection: s.can_choose_section,
        })),
      };
    });
  }

  private async getSlotCapacity(
    schoolId: number,
  ): Promise<EnrollmentSchedule['gradeLevelFormat']['schoolCapacity']> {
    const maxStudentCount = await this.prisma.school_subscription.findFirst({
      where: {
        school_id: schoolId,
      },
      select: {
        plan: {
          select: {
            max_student_count: true,
          },
        },
      },
    });

    const currentApplicationCount =
      await this.prisma.enrollment_application.count({
        where: {
          student: {
            user_student_enroller_idTouser: {
              school_id: schoolId,
            },
          },
        },
      });

    return {
      totalCapacity: maxStudentCount?.plan.max_student_count || 0,
      remainingSlots:
        maxStudentCount?.plan.max_student_count || 0 - currentApplicationCount,
    };
  }

  // for storing
  private async formatDataToStoreSemi(
    data: EnrollmentSchedule['receivedData']['schedDate'],
  ): Promise<EnrollmentSchedule['preliminaryProccessOutput']> {
    const toStoreData: EnrollmentSchedule['preliminaryProccessOutput'] =
      await Promise.all(
        data.map(async (m) => {
          const { startDate, endDate } = await this.processDates(
            m.DateString,
            m.startTime,
            m.endTime,
          );

          return {
            start_date_time: startDate,
            end_date_time: endDate,
            is_paused: m.isPaused,
          };
        }),
      );

    return toStoreData;
  }

  private async getAllGradeLevelOfferedId(
    gradeLevelCodeArr: string[],
    schoolId: number,
  ): Promise<number[]> {
    const idArr = await this.prisma.grade_level_offered.findMany({
      where: {
        grade_level_code: {
          in: gradeLevelCodeArr,
        },
        school_id: schoolId,
      },
      select: {
        grade_level_offered_id: true,
      },
    });

    return idArr.map((id) => id.grade_level_offered_id);
  }

  private async processDates(
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<EnrollmentSchedule['processStringDateReturn']> {
    return {
      startDate: new Date(`${date}, ${startTime}`),
      endDate: new Date(`${date}, ${endTime}`),
    };
  }

  private async finalProcess(
    gradeLevelOfferedIdArr: number[],
    processedData: EnrollmentSchedule['preliminaryProccessOutput'],
    canChooseSection: boolean,
    applicationSlot: number,
  ): Promise<EnrollmentSchedule['storeData']> {
    const toStoreData: EnrollmentSchedule['storeData'] = await Promise.all(
      gradeLevelOfferedIdArr.flatMap((g) => {
        return processedData.map((d) => ({
          grade_level_offered_id: g,
          application_slot: applicationSlot,
          start_datetime: d.start_date_time,
          end_datetime: d.end_date_time,
          is_paused: d.is_paused,
          can_choose_section: canChooseSection,
        }));
      }),
    );

    return toStoreData;
  }

  private async storeDataInDb(
    data: EnrollmentSchedule['storeData'],
  ): Promise<EnrollmentSchedule['processReturn']> {
    await this.prisma.enrollment_schedule.createMany({
      data: data,
    });

    return { message: 'Enrollment schedule saved successfully' };
  }
}
