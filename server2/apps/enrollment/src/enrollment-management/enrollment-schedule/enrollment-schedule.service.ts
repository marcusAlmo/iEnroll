import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { EnrollmentSchedule } from './interface/enrollment-schedule.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

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

  // UTILITY FUNCTIONS

  // for retrieval
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

  private async processRawData(
    gradeLevelRaw: EnrollmentSchedule['gradeLevelRaw'],
    schoolId: number,
  ): Promise<EnrollmentSchedule['processedGradeLevel']> {
    const slotCount: string = await this.getSlotCapacity(schoolId);

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
        slotCapacity: slotCount,
      };
    });
  }

  private async getSlotCapacity(schoolId: number): Promise<string> {
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

    return `${maxStudentCount?.plan.max_student_count || 0}/${currentApplicationCount}`;
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
