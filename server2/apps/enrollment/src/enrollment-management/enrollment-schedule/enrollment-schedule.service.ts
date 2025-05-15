import { $Enums } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentSchedule } from './interface/enrollment-schedule.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { DateTimeUtilityService } from '@lib/date-time-utility/date-time-utility.service';
import { JsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class EnrollmentScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtility: MicroserviceUtilityService,
  ) {}

  // this method returns all grades
  public async getAllGrades(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const processedSchedule: EnrollmentSchedule['gradeLevelFormat'] =
      await this.collectData(schoolId);

    return this.microserviceUtility.returnSuccess(processedSchedule);
  }

  // this method stores new sched to the database
  public async storeData(
    data: EnrollmentSchedule['receivedData'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const gradeLevelOfferedId: EnrollmentSchedule['scheduleReturn'] | null =
      await this.retrieveGradeLevelOfferedId(data.gradeLevel, schoolId);

    if (!gradeLevelOfferedId)
      return this.microserviceUtility.notFoundExceptionReturn(
        'Grade level not found',
      );

    const processedData: EnrollmentSchedule['storeData'] =
      await this.processNewScheduleData(data, gradeLevelOfferedId.id);

    const result = await this.storeScheduleData(processedData);

    return result.success
      ? this.microserviceUtility.returnSuccess({ message: result.message })
      : this.microserviceUtility.internalServerErrorReturn(result.message);
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
    status: boolean,
  ): Promise<MicroserviceUtility['returnValue']> {
    await this.prisma.enrollment_schedule.update({
      where: {
        schedule_id: scheduleId,
      },
      data: {
        is_paused: status,
      },
    });

    return this.microserviceUtility.returnSuccess({
      message:
        'Enrollment schedule ' +
        (status ? 'paused' : 'activated') +
        ' successfully',
    });
  }

  public async updateAllowSectionSelection(
    gradeLevel: string,
    schoolId: number,
  ) {
    const id: EnrollmentSchedule['scheduleReturn'] | null =
      await this.retrieveGradeLevelOfferedId(gradeLevel, schoolId);

    if (!id)
      return this.microserviceUtility.notFoundExceptionReturn(
        'Data to be updated not found',
      );

    const result: EnrollmentSchedule['processReturn'] =
      await this.updateAllowSelection(id.id, id.pastValue);

    if (result.message == 'Value updated successfully')
      return this.microserviceUtility.returnSuccess(result);

    return this.microserviceUtility.internalServerErrorReturn(result.message);
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

  private async getGradeLevels(
    schoolId: number,
  ): Promise<EnrollmentSchedule['gradeLevelCollection'][]> {
    const supportedAcademicLevels: { supported_acad_level: JsonValue } | null =
      await this.prisma.school.findFirst({
        where: {
          school_id: schoolId,
        },
        select: {
          supported_acad_level: true,
        },
      });

    if (!supportedAcademicLevels) return [];

    const data = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        grade_level: {
          academic_level: {
            academic_level: {
              in: supportedAcademicLevels.supported_acad_level as string[],
            },
          },
        },
      },
      select: {
        can_choose_section: true,
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
        grade_level_program: {
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
        grade_level_program: {
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
        d.grade_level_program.grade_level_offered.grade_level.grade_level,
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

    return {
      totalCapacity: maxStudentCount?.plan.max_student_count || 0,
      remainingSlots:
        maxStudentCount?.plan.max_student_count || 0 - currentApplicationCount,
    };
  }

  // for storing data
  private async processNewScheduleData(
    data: EnrollmentSchedule['receivedData'],
    gradeLevelOfferedId: number,
  ): Promise<EnrollmentSchedule['storeData']> {
    const processedDataArr: EnrollmentSchedule['storeData'] = [];

    for (const d of data.schedDate) {
      for (const t of d.timeRanges) {
        processedDataArr.push({
          grade_level_offered_id: gradeLevelOfferedId,
          application_slot: d.applicationSlot,
          start_datetime: DateTimeUtilityService.stringToDate(
            d.DateString,
            t.startTime,
          ),
          end_datetime: DateTimeUtilityService.stringToDate(
            d.DateString,
            t.endTime,
          ),
        });
      }
    }

    return processedDataArr;
  }

  private async storeScheduleData(
    data: EnrollmentSchedule['storeData'],
  ): Promise<EnrollmentSchedule['storeDataReturn']> {
    const result = await this.prisma.enrollment_schedule.createManyAndReturn({
      data: data,
    });

    if (result.length == 0) {
      return {
        success: false,
        message: 'Failed creating enrollment schedule',
      };
    }

    const auxScheduleSlot: EnrollmentSchedule['auxScheduleSlot'][] = [];

    for (const r of result) {
      auxScheduleSlot.push({
        schedule_id: r.schedule_id,
        application_slot_left: r.application_slot,
        grade_level_offered_id: r.grade_level_offered_id,
        start_datetime: r.start_datetime,
        end_datetime: r.end_datetime,
        is_closed: false,
      });
    }

    const result2 = await this.prisma.aux_schedule_slot.createMany({
      data: auxScheduleSlot,
    });

    return {
      success: result2.count > 0,
      message:
        result2.count > 0
          ? 'Enrollment schedule created successfully'
          : 'Failed creating enrollment schedule',
    };
  }

  // for updating allow section selection

  private async retrieveGradeLevelOfferedId(
    gradeLevel: string,
    schoolId: number,
  ): Promise<EnrollmentSchedule['scheduleReturn'] | null> {
    const data = await this.prisma.grade_level_offered.findFirst({
      where: {
        school_id: schoolId,
        grade_level: {
          grade_level: gradeLevel,
        },
      },
      select: {
        grade_level_offered_id: true,
        can_choose_section: true,
      },
    });

    if (!data) return null;

    return {
      id: data.grade_level_offered_id,
      pastValue: data.can_choose_section,
    };
  }

  private async updateAllowSelection(
    id: number,
    pastValue: boolean,
  ): Promise<EnrollmentSchedule['processReturn']> {
    const result = await this.prisma.grade_level_offered.update({
      where: {
        grade_level_offered_id: id,
      },
      data: {
        can_choose_section: !pastValue,
      },
    });

    return {
      message: result ? 'Value updated successfully' : 'Failed updating value',
    };
  }
}
