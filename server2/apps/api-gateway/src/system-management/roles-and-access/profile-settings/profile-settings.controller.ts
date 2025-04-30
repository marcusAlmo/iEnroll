import { Controller, Get, Param, Body, Put, Post } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { User } from '@lib/decorators/user.decorator';
import {
  CreateEmployeeDto,
  UpdateProfileSettingsDto,
} from './dto/profile-settings.dto';

@Controller('profile-settings')
export class ProfileSettingsController {
  constructor(
    private readonly profileSettingsService: ProfileSettingsService,
  ) {}

  @Get('get-employee-info/:id')
  async getEmployeeInfo(
    @Param('id') id: string,
    @User('school_id') schoolId: number,
  ) {
    return this.profileSettingsService.getEmployeeInfo({
      employeeId: Number(id),
      schoolId,
    });
  }

  @Put('update-employee-info/:id')
  async updateEmployeeInfo(
    @Param('id') id: string,
    @Body() payload: UpdateProfileSettingsDto,
  ) {
    return this.profileSettingsService.updateProfileSettings({
      employeeId: Number(id),
      data: payload,
    });
  }

  @Post('create-employee')
  async createEmployee(@Body() payload: CreateEmployeeDto) {
    return this.profileSettingsService.createEmployee({
      data: payload,
    });
  }
}
