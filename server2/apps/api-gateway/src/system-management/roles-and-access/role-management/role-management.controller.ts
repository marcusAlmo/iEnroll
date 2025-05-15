import { Controller, Put, Param, Body } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagement } from './dto/role-management.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('role-management')
@UseGuards(JwtAuthGuard)
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
