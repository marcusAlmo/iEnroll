import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { EnrollmentSchedule } from './interface/enrollment-schedule.interface';

@Controller('enrollment-schedule')
export class EnrollmentScheduleController {
  constructor(
    private readonly enrollmentScheduleService: EnrollmentScheduleService,
  ) {}

  @MessagePattern({ cmd: 'get-all-schedules' })
  async getAllGrades(payload: {
    schoolId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    console.log('schoolIdL: ', payload.schoolId);
    return this.enrollmentScheduleService.getAllGrades(payload.schoolId);
  }

  @MessagePattern({ cmd: 'store-data' })
  async storeData(payload: {
    data: EnrollmentSchedule['receivedData'];
    schoolId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.enrollmentScheduleService.storeData(
      payload.data,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'pause-schedule' })
  async pauseSchedule(payload: {
    scheduleId: number;
    status: boolean;
  }): Promise<MicroserviceUtility['returnValue']> {
    return this.enrollmentScheduleService.pauseSchedule(
      payload.scheduleId,
      payload.status,
    );
  }

  @MessagePattern({ cmd: 'delete-schedule' })
  async deleteSchedule(payload: {
    scheduleId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    console.log('scheduleId: ', payload.scheduleId);
    return this.enrollmentScheduleService.deleteSchedule(payload.scheduleId);
  }

  @MessagePattern({ cmd: 'update-allow-selection' })
  async updateAllowSelection(payload: {
    gradeLevel: string;
    schoolId: number;
  }) {
    return this.enrollmentScheduleService.updateAllowSectionSelection(
      payload.gradeLevel,
      payload.schoolId,
    );
  }
}
