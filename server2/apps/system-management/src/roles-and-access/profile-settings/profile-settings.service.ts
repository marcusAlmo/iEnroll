import { $Enums } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProfileSettings } from './interface/profile-settings.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { AuthService } from '@lib/auth/auth.service';

@Injectable()
export class ProfileSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly authService: AuthService,
  ) {}

  // retrieve employee info
  public async getEmployeeInfo(
    userId: number,
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const employeeInfo: ProfileSettings['employeeInfo'] | null =
      await this.getEmployeeInfoRaw(schoolId, userId);

    return this.microserviceUtilityService.returnSuccess(employeeInfo);
  }

  // update profile settings
  public async updateProfileSettings(
    employeeId: number,
    data: ProfileSettings['updateProfileSettings'],
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.saveProfileSettings(employeeId, data);

    if (!result)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'Failed updating profile settings',
      );

    return this.microserviceUtilityService.returnSuccess({
      message: 'Profile settings updated successfully',
    });
  }

  // create employee
  public async createEmployee(
    data: ProfileSettings['createProfileSettings'],
    schooolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const hashedPassword = await this.authService.hashPassword(data.password);

    const result = await this.prisma.user.create({
      data: {
        first_name: data.fName,
        middle_name: data.mName,
        last_name: data.lName,
        suffix: data.suffix,
        gender: data.gender,
        contact_number: data.phone,
        school_id: schooolId,
        username: data.username,
        email_address: data.email,
        password_hash: hashedPassword,
      },
    });

    if (!result)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'Failed creating employee',
      );

    const accessListResult = await this.prisma.access_list.create({
      data: {
        user_id: result.user_id,
        role: $Enums.role_type.registrar,
        dashboard_access: $Enums.access_type_access_list.read,
        enrollment_management_access: $Enums.access_type_access_list.read,
        enrollment_review_access: $Enums.access_type_access_list.read,
        personnel_center_access: $Enums.access_type_access_list.read,
        system_settings_access: $Enums.access_type_access_list.read,
      },
    });

    if (!accessListResult)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'Failed creating access list',
      );

    return this.microserviceUtilityService.returnSuccess({
      message: 'Employee created successfully',
    });
  }

  // UTILITY FUNCTIONS

  // for retrieving employee info
  private async getEmployeeInfoRaw(
    schoolId: number,
    userId: number,
  ): Promise<ProfileSettings['employeeInfo'] | null> {
    const result = await this.prisma.access_list.findFirst({
      where: {
        user_id: userId,
        user: {
          school_id: schoolId,
        },
      },
      select: {
        user: {
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            suffix: true,
            gender: true,
            contact_number: true,
            email_address: true,
            username: true,
          },
        },
        role: true,
        dashboard_access: true,
        enrollment_management_access: true,
        enrollment_review_access: true,
        personnel_center_access: true,
        system_settings_access: true,
      },
    });

    if (!result) return null;

    return {
      profileSettings: {
        personalInformation: {
          fName: result.user.first_name,
          mName: result.user.middle_name ?? '',
          lName: result.user.last_name,
          suffix: result.user.suffix ?? '',
          gender: result.user.gender,
        },
        contactInformation: {
          phone: result.user.contact_number,
        },
      },
      accountSettings: {
        username: result.user.username,
        email: result.user.email_address ?? '',
      },
      roleManagement: {
        role: result.role,
        dashboardAccess: result.dashboard_access,
        enrollmentManagement: result.enrollment_management_access,
        enrollmentReview: result.enrollment_review_access,
        personnelCenter: result.personnel_center_access,
        systemSettings: result.system_settings_access,
      },
    };
  }

  // for updating the profile settings
  private async saveProfileSettings(
    employeeId: number,
    data: ProfileSettings['updateProfileSettings'],
  ): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: {
        user_id: employeeId,
      },
      data: {
        first_name: data.fName,
        middle_name: data.mName,
        last_name: data.lName,
        suffix: data.suffix,
        gender: data.gender,
        contact_number: data.phone,
      },
    });

    return result ? true : false;
  }
}
