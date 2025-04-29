import { $Enums } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProfileSettings } from './interface/profile-settings.interface';
import { StringUtilityService } from '@lib/string-utility/string-utility.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class ProfileSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly stringUtilityService: StringUtilityService,
  ) {}

  public async getEmployeeList(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const employeeRaw: ProfileSettings['employeeList'][] =
      await this.retrieveEmployees(schoolId);

    return this.microserviceUtilityService.returnSuccess(employeeRaw);
  }

  // UTILITY FUNCTIONS

  // for retrieving employee list
  private async retrieveEmployees(
    schoolId: number,
  ): Promise<ProfileSettings['employeeList'][]> {
    const employeeRoleCodes = [
      $Enums.role_type.admin,
      $Enums.role_type.registrar,
    ];

    const condition = this.conditionalForEmployeeList(
      employeeRoleCodes,
      schoolId,
    );

    const employeeListRaw = await this.prisma.user.findMany({
      where: condition,
      select: {
        first_name: true,
        middle_name: true,
        last_name: true,
        suffix: true,
        access_list: {
          select: {
            role: true,
          },
        },
      },
    });

    return employeeListRaw.map((e) => {
      const fName: string = e.first_name;
      const mName: string = e.middle_name ?? '';
      const lName: string = e.last_name;
      const suffix: string = e.suffix ?? '';
      const role: string = e.access_list?.role ?? '';
      return {
        name: `${fName} ${mName} ${lName} ${suffix}`,
        role: role,
      };
    });
  }

  private conditionalForEmployeeList(
    employeeRoleCodes: $Enums.role_type[],
    schoolId: number,
  ) {
    return {
      school_id: schoolId,
      access_list: {
        role: {
          in: employeeRoleCodes,
        },
      },
    };
  }
}
