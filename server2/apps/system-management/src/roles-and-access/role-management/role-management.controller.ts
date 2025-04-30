import { Controller } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { MessagePattern } from '@nestjs/microservices';
import { RoleManagement } from './interface/role-management.interface';

@Controller('role-management')
export class RoleManagementController {
  constructor(private readonly rolManagementService: RoleManagementService) {}

  @MessagePattern({ cmd: 'update-role-management' })
  public async updateRoleManagement(payload: {
    employeeId: number;
    data: RoleManagement['updateRoleManagement'];
  }) {
    return await this.rolManagementService.updateRoleManagement(
      payload.employeeId,
      payload.data,
    );
  }
}
