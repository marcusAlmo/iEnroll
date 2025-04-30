import { Controller } from '@nestjs/common';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { Get, Post, Body, Param } from '@nestjs/common';
import { User } from '@lib/decorators/user.decorator';
import { EnrollmentScheduleDTO } from './dto/enrollment-schedule.dto';

@Controller('enrollment-schedule')
export class EnrollmentScheduleController {
  constructor(
    private readonly enrollmentScheduleService: EnrollmentScheduleService,
  ) {}

  @Get('get-all-schedules')
  async getAllGrades(@User('school_id') schoolId: number) {
    schoolId = 0;
    return await this.enrollmentScheduleService.getAllGrades(schoolId);
  }

  @Post('store-data')
  async storeData(
    @User('school_id') schoolId: number,
    @Body() payload: EnrollmentScheduleDTO,
  ) {
    schoolId = 0;
    return await this.enrollmentScheduleService.storeData({
      payload,
      schoolId,
    });
  }

  @Post('pause-schedule/:scheduleId')
  async pauseSchedule(@Param('scheduleId') scheduleId: string) {
    return await this.enrollmentScheduleService.pauseSchedule({
      scheduleId,
    });
  }

  @Post('delete-schedule/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduleId: string) {
    return await this.enrollmentScheduleService.deleteSchedule({
      scheduleId,
    });
  }
}
