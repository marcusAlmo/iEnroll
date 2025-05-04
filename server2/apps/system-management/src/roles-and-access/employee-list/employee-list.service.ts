import { $Enums } from '@prisma/client';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { StringUtilityService } from '@lib/string-utility/string-utility.service';
import { Injectable } from '@nestjs/common';
import { EmployeeList } from './interface/employee-list.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class EmployeeListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly stringUtilityService: StringUtilityService,
  ) {}

  // retrieve employee list
  public async getEmployeeList(
    schoolId: number,
    name: string,
  ): Promise<MicroserviceUtility['returnValue']> {
    const employeeRaw: EmployeeList['employeeList'][] =
      await this.retrieveEmployees(schoolId, name);

    return this.microserviceUtilityService.returnSuccess(employeeRaw);
  }

  // UTILITY FUNCTINO

  // for retrieving employee list
  private async retrieveEmployees(
    schoolId: number,
    name: string,
  ): Promise<EmployeeList['employeeList'][]> {
    if (name && name.length > 0) {
      const employeeRaw: EmployeeList['employeeList'][] =
        await this.queryRawUnsafe(name, schoolId);

      return employeeRaw;
    } else {
      const employeeRaw: EmployeeList['employeeList'][] =
        await this.queryStandard(schoolId);

      return employeeRaw;
    }
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

  private async queryRawUnsafe(
    name: string,
    schoolId: number,
  ): Promise<EmployeeList['employeeList'][]> {
    // Join conditions with AND
    const whereClause = `LOWER(CONCAT_WS(' ', COALESCE(ep.first_name, ''), COALESCE(ep.middle_name, ''), COALESCE(ep.last_name, ''), COALESCE(ep.suffix, ''))) LIKE LOWER('%${name}%') AND al.role IN ('admin', 'registrar') AND ep.school_id = ${schoolId}`;

    // Ensure the query is well-formed with explicit semicolon
    const finalQuery = `
      SELECT
        ep.user_id,
        ep.first_name,
        ep.middle_name,
        ep.last_name,
        ep.suffix,
        al.role
      FROM
        enrollment.user as ep
      JOIN
        enrollment.access_list as al ON ep.user_id = al.user_id
      WHERE
        ${whereClause};`.trim();

    const result = await this.prisma.$queryRawUnsafe(finalQuery);

    // eslint-disable-next-line
    if (!result || (result as any[]).length === 0)
        return [];

    const retrievedData: EmployeeList['queryUnsafeEmployeeList'][] =
      result as EmployeeList['queryUnsafeEmployeeList'][];

    return retrievedData.map((e) => {
      const fName: string = e.first_name;
      const mName: string = e.middle_name ?? '';
      const lName: string = e.last_name;
      const suffix: string = e.suffix ?? '';
      const role: string = e.role;
      return {
        userId: e.user_id,
        name: this.stringUtilityService.extraSpaceRemover(
          `${fName} ${mName} ${lName} ${suffix}`,
        ),
        role: role,
      };
    });
  }

  private async queryStandard(
    schoolId: number,
  ): Promise<EmployeeList['employeeList'][]> {
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
        user_id: true,
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
        userId: e.user_id,
        name: this.stringUtilityService.extraSpaceRemover(
          `${fName} ${mName} ${lName} ${suffix}`,
        ),
        role: role,
      };
    });
  }
}
