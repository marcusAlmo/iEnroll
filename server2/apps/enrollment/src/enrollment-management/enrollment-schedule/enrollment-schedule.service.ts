import { $Enums } from '@prisma/client';
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
    const processedSchedule: EnrollmentSchedule['gradeLevelFormat'] =
      await this.collectData(schoolId);

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
  ): Promise<EnrollmentSchedule['gradeLevelFormat']> {
    const gradeLevels: EnrollmentSchedule['gradeLevelCollection'][] =
      await this.getGradeLevels(schoolId);
    const slotCapacity: EnrollmentSchedule['gradeLevelFormat']['schoolCapacity'] =
      await this.getSlotCapacity(schoolId);
    const gradeSections: EnrollmentSchedule['sectionRaw'][] =
      await this.getGradeSection(gradeLevels, schoolId);
    const gradeSchedule: EnrollmentSchedule['scheduleRaw'][] =
      await this.getgradeSchedule(schoolId);

    const processedschedules: EnrollmentSchedule['schedule'][] =
      await this.mergeSchedules(gradeSchedule);

    const finalOutput: EnrollmentSchedule['gradeLevelFormat'] = {
      schoolCapacity: slotCapacity,
      gradeLevels: gradeLevels.map((item) => {
        return {
          gradeLevel: item.gradeLevel,
          allowSectionSelection: item.allowSectionSelection,
          sections: gradeSections
            .filter((section) => section.gradeLevel === item.gradeLevel)
            .map((i) => {
              return {
                sectionName: i.sectionName,
                sectionCapacity: i.sectionCapacity,
                maximumApplication: i.maximumApplication,
                currentEnrolled: i.currentEnrolled,
              };
            }),
          schedules: processedschedules
            .filter((schedule) => schedule.gradeLevel === item.gradeLevel)
            .map((i) => {
              return {
                id: i.id,
                date: i.date,
                timeRanges: i.timeRanges,
                applications: i.applications,
                status: i.status,
                gradeLevel: i.gradeLevel,
              };
            }),
        };
      }),
    };

    return finalOutput;
  }

  private async mergeSchedules(
    scheduleRaw: EnrollmentSchedule['scheduleRaw'][],
  ): Promise<EnrollmentSchedule['schedule'][]> {
    const grouped = new Map<string, EnrollmentSchedule['scheduleRaw'][]>();

    for (const entry of scheduleRaw) {
      const key = `${entry.gradeLevel}|${entry.date}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(entry);
    }

    const schedule: EnrollmentSchedule['schedule'][] = [];

    for (const group of grouped.values()) {
      const first = group[0];

      schedule.push({
        id: first.id,
        date: first.date,
        timeRanges: group.flatMap((item) => item.timeRanges),
        applications: group.reduce((sum, item) => sum + item.applications, 0),
        status: first.status,
        gradeLevel: first.gradeLevel,
      });
    }

    return schedule;
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

  private async getGradeLevels(
    schoolId: number,
  ): Promise<EnrollmentSchedule['gradeLevelCollection'][]> {
    const data = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
      },
      select: {
        can_choose_section: true,
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    return data.map((d) => ({
      gradeLevel: d.grade_level.grade_level,
      allowSectionSelection: d.can_choose_section,
    }));
  }

  private async getGradeSection(
    gradeLevels: EnrollmentSchedule['gradeLevelCollection'][],
    schoolId: number,
  ): Promise<EnrollmentSchedule['sectionRaw'][]> {
    const data = await this.prisma.grade_section.findMany({
      where: {
        grade_section_program: {
          grade_level_offered: {
            grade_level: {
              grade_level: {
                in: gradeLevels.map((d) => d.gradeLevel),
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
      },
    });

    console.log(data);

    return data.map((d) => ({
      id: d.schedule_id,
      applications: d.aux_schedule_slot
        ? d.aux_schedule_slot.enrollment_application.length
        : 0,
      gradeLevel: d.grade_level_offered.grade_level.grade_level,
      date: DateTimeUtilityService.getDateTOString(d.start_datetime),
      timeRanges: {
        startTime: DateTimeUtilityService.getTime12HourFormatUTC(
          new Date(d.start_datetime),
        ),
        endTime: DateTimeUtilityService.getTime12HourFormatUTC(
          new Date(d.end_datetime),
        ),
      },
      status: d.is_paused ? 'paused' : 'active',
    }));
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
    console.log('currentApplicationCount', currentApplicationCount);
    console.log('maxStudentCount', maxStudentCount);

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
