import { lastValueFrom } from 'rxjs';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmployeeList } from 'apps/system-management/src/roles-and-access/employee-list/interface/employee-list.interface';

@Injectable()
export class EmployeeListService {
  constructor(
    @Inject('SYSTEM_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getEmployeeList(
    payload: object,
  ): Promise<EmployeeList['employeeList']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-employee-list' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EmployeeList['employeeList'];
  }
}
