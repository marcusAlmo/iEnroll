import { Controller } from '@nestjs/common';
import { EmployeeListService } from './employee-list.service';
import { MessagePattern } from '@nestjs/microservices';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Controller('employee-list')
export class EmployeeListController {
  constructor(private readonly employeeListService: EmployeeListService) {}

  @MessagePattern({ cmd: 'get-employee-list' })
  public async getEmployeeList(payload: {
    schoolId: number;
    name: string;
  }): Promise<MicroserviceUtility['returnValue']> {
    return await this.employeeListService.getEmployeeList(
      payload.schoolId,
      payload.name,
    );
  }
}
