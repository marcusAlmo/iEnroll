import { Controller } from '@nestjs/common';
import { EnrollmentScheduleService } from './enrollment-schedule.service';
import { Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { User } from '@lib/decorators/user.decorator';
import { EnrollmentScheduleDTO } from './dto/enrollment-schedule.dto';

@Controller('enrollment-schedule')
export class EnrollmentScheduleController {
  constructor(
    private readonly enrollmentScheduleService: EnrollmentScheduleService,
  ) {}

  @Get('get-all-schedules')
  async getAllGrades(@User('school_id') schoolId: number) {
    return await this.enrollmentScheduleService.getAllGrades({ schoolId });
  }

  @Post('store-data')
  async storeData(
    @User('school_id') schoolId: number,
    @Body() payload: EnrollmentScheduleDTO,
  ) {
    return await this.enrollmentScheduleService.storeData({
      data: payload,
      schoolId,
    });
  }

  @Put('pause-schedule')
  async pauseSchedule(
    @Query('scheduleId') scheduleId: string,
    @Query('status') status: string,
  ) {
    const numberId = Number(scheduleId);
    const booleanStatus = status === 'true';
    return await this.enrollmentScheduleService.pauseSchedule({
      scheduleId: numberId,
      status: booleanStatus,
    });
  }

  @Delete('delete-schedule/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduleId: string) {
    const numberId = Number(scheduleId);
    return await this.enrollmentScheduleService.deleteSchedule({
      scheduleId: numberId,
    });
  }

  @Put('update-allow-selection')
  async updateAllowSelection(
    @Query('gradeLevel') gradeLevel: string,
    @User('school_id') schoolId: number,
  ) {
    schoolId = 0;
    return await this.enrollmentScheduleService.updateAllowSelection({
      gradeLevel,
      schoolId,
    });
  }
}
