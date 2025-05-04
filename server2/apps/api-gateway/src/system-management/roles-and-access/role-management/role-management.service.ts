import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { RoleManagement } from 'apps/system-management/src/roles-and-access/role-management/interface/role-management.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RoleManagementService {
  constructor(
    @Inject('SYSTEM_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async updateRoleManagement(
    payload: object,
  ): Promise<RoleManagement['response']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'update-role-management' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as RoleManagement['response'];
  }
}
