import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeListService } from './employee-list.service';
import { EmployeeList } from 'apps/system-management/src/roles-and-access/employee-list/interface/employee-list.interface';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('employee-list')
@UseGuards(JwtAuthGuard)
export class EmployeeListController {
  constructor(private readonly employeeListService: EmployeeListService) {}

  @Get('retrieve')
  public async getEmployeeList(
    @User('school_id') schoolId: number,
    @Query() name: string,
  ): Promise<EmployeeList['employeeList']> {
    return await this.employeeListService.getEmployeeList({
      schoolId,
      name,
    });
  }
}
