import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { AccountSettings } from './interface/account-settings.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { AuthService } from '@lib/auth/auth.service';

@Injectable()
export class AccountSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly authService: AuthService,
  ) {}

  // update account settings
  public async updateAccountSettings(
    employeeId: number,
    data: AccountSettings['updateAccountSettings'],
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.saveAccountSettings(employeeId, data);

    if (!result)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'Failed updating account settings',
      );

    return this.microserviceUtilityService.returnSuccess({
      message: 'Account settings updated successfully',
    });
  }

  // UTILITY FUNCTION
  private async saveAccountSettings(
    employeeId: number,
    data: AccountSettings['updateAccountSettings'],
  ): Promise<boolean> {
    const dataUpdate: any = {
      username: data.username,
      email_address: data.email,
    };

    if (data.password) {
      const hashedPassword = await this.authService.hashPassword(data.password);
      dataUpdate.password_hash = hashedPassword;
    }

    const result = await this.prisma.user.update({
      where: {
        user_id: employeeId,
      },
      data: dataUpdate,
    });

    return result ? true : false;
  }
}
