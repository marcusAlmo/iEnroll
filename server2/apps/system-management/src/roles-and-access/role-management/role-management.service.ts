import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RoleManagement } from './interface/role-management.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class RoleManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  // update role management
  public async updateRoleManagement(
    employeeId: number,
    data: RoleManagement['updateRoleManagement'],
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.saveRoleManagement(employeeId, data);

    if (!result)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'Failed updating role management',
      );

    return this.microserviceUtilityService.returnSuccess({
      message: 'Role management updated successfully',
    });
  }

  // UTILITY FUNCTION

  // for updating the role management
  private async saveRoleManagement(
    employeeId: number,
    data: RoleManagement['updateRoleManagement'],
  ): Promise<boolean> {
    const result = await this.prisma.access_list.update({
      where: {
        user_id: employeeId,
      },
      data: {
        role: data.role,
        dashboard_access: data.dashboardAccess,
        enrollment_management_access: data.enrollmentManagement,
        enrollment_review_access: data.enrollmentReview,
        personnel_center_access: data.personnelCenter,
        system_settings_access: data.systemSettings,
      },
    });

    return result ? true : false;
  }
}
