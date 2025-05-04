import { Controller } from '@nestjs/common';
import { ProfileSettingsService } from './profile-settings.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileSettings } from './interface/profile-settings.interface';

@Controller('profile-settings')
export class ProfileSettingsController {
  constructor(
    private readonly profileSettingsService: ProfileSettingsService,
  ) {}

  @MessagePattern({ cmd: 'get-employee-info' })
  public async getEmployeeInfo(payload: { userId: number; schoolId: number }) {
    return await this.profileSettingsService.getEmployeeInfo(
      payload.userId,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'update-profile-settings' })
  public async updateProfileSettings(payload: {
    employeeId: number;
    data: ProfileSettings['updateProfileSettings'];
  }) {
    return await this.profileSettingsService.updateProfileSettings(
      payload.employeeId,
      payload.data,
    );
  }

  @MessagePattern({ cmd: 'create-employee' })
  public async createEmployee(payload: {
    schoolId: number;
    data: ProfileSettings['createProfileSettings'];
  }) {
    return await this.profileSettingsService.creteEmployee(
      payload.schoolId,
      payload.data,
    );
  }
}
