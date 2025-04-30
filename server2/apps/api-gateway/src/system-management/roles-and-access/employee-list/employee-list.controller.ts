import { Controller, Get, Body } from '@nestjs/common';
import { EmployeeListService } from './employee-list.service';
import { EmployeeList } from 'apps/system-management/src/roles-and-access/employee-list/interface/employee-list.interface';
import { User } from '@lib/decorators/user.decorator';
import { EmployeeListDto } from './dto/employee-list.dto';

@Controller('employee-list')
export class EmployeeListController {
  constructor(private readonly employeeListService: EmployeeListService) {}

  @Get('retrieve')
  public async getEmployeeList(
    @User('school_id') schoolId: number,
    @Body() payload: EmployeeListDto,
  ): Promise<EmployeeList['employeeList']> {
    return await this.employeeListService.getEmployeeList({
      schoolId,
      name: payload.name,
    });
  }
}
