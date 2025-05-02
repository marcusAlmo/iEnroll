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
  async storeData(
    data: EnrollmentSchedule['receivedData'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    return this.enrollmentScheduleService.storeData(data, schoolId);
  }

  @MessagePattern({ cmd: 'pause-schedule' })
  async pauseSchedule(
    scheduleId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    return this.enrollmentScheduleService.pauseSchedule(scheduleId);
  }

  @MessagePattern({ cmd: 'delete-schedule' })
  async deleteSchedule(
    scheduleId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    return this.enrollmentScheduleService.deleteSchedule(scheduleId);
  }
}
