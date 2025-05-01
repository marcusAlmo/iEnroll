import { Controller, Put, Param, Body } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagement } from './dto/role-management.dto';

@Controller('role-management')
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  @Put('update-role-management/:id')
  async updateRoleManagement(
    @Param('id') id: string,
    @Body() payload: RoleManagement,
  ) {
    return this.roleManagementService.updateRoleManagement({
      employeeId: Number(id),
      data: payload,
    });
  }
}
