import { AddressService } from '@lib/address';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LandingService {
  private readonly logger = new Logger(LandingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly addressService: AddressService,
  ) {}

  async getPartnerSchools() {
    try {
      const result = await this.prisma.school.findMany({
        select: {
          school_id: true,
          name: true,
          address: {
            select: {
              address_line_1: true,
              street_id: true,
            },
          },
          contact_number: true,
        },
        where: {
          is_active: true,
        },
      });

      const schools = await Promise.all(
        result.map(async (data) => {
          let address = data.address.address_line_1;

          // If address_line_1 is empty, fetch using street_id
          if (!address && data.address.street_id) {
            const addressReturn =
              await this.addressService.getFullAddressByStreetId(
                data.address.street_id,
                this.prisma,
              );

            if (!addressReturn.success) {
              this.logger.error(
                `Failed to resolve address for school "${data.name}" (ID: ${data.school_id}): ${addressReturn.code}`,
              );
              throw new RpcException({
                statusCode: 500,
                error: addressReturn.code,
              });
            }

            address = addressReturn.data.fullAddress;
          }

          return {
            schoolId: data.school_id,
            name: data.name,
            contactNumber: data.contact_number,
            address,
          };
        }),
      );

      return schools;
    } catch (err) {
      this.logger.error('Unexpected error while fetching partner schools', err);
      throw new RpcException({
        statusCode: 500,
        error: 'ERR_INTERNAL_SERVER',
      });
    }
  }

  async getAnnouncements() {
    const result = await this.prisma.banner.findMany({
      select: {
        subject: true,
        message: true,
        update_datetime: true,
        creation_datetime: true,
        school: {
          select: {
            school_id: true,
            name: true,
          },
        },
      },
      where: {
        is_active: true,
      },
    });

    return result.map(
      ({
        subject,
        message,
        creation_datetime,
        update_datetime,
        school: { school_id, name },
      }) => ({
        subject,
        message,
        createdAt: creation_datetime,
        updatedAt: update_datetime,
        schoolId: school_id,
        schoolName: name,
      }),
    );
  }
}
