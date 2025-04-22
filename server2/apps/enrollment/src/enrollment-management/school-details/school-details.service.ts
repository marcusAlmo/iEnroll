import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { SchoolDetails } from './interface/school-details.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class SchoolDetailsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MicroserviceUtility: MicroserviceUtilityService,
  ) {}

  public async getSchoolDetails(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.prisma.school.findFirst({
      where: {
        school_id: schoolId,
      },
      select: this.baseSelect(),
    });

    if (!result)
      return this.MicroserviceUtility.returnSuccess({
        schoolName: '',
        schoolContact: '',
        schoolId: null,
        schoolEmail: '',
        schoolWebUrl: '',
        schoolAddress: '',
        street: '',
        district: '',
        municipality: '',
        province: '',
      });

    return this.MicroserviceUtility.returnSuccess({
      schoolName: result.name,
      schoolContact: result.contact_number,
      schoolId: result.school_id,
      schoolEmail: result.email_address,
      schoolWebUrl: result.website_url,
      schoolAddress: result.address.address_line_1,
      street: result.address.street.street,
      district: result.address.street.district.district,
      municipality: result.address.street.district.municipality.municipality,
      province: result.address.street.district.municipality.province.province,
    });
  }

  public async saveSchoolDetails(
    schoolDetails: SchoolDetails['scholarDetails'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const address = await this.prisma.address.findFirst({
      where: { address_line_1: schoolDetails.schoolAddress },
      select: {
        address_id: true,
      },
    });

    if (!address)
      return this.MicroserviceUtility.notFoundExceptionReturn(
        'School address not found',
      );

    const result = await this.prisma.school.update({
      where: { school_id: schoolId },
      data: {
        name: schoolDetails.schoolName,
        contact_number: schoolDetails.schoolContact,
        email_address: schoolDetails.schoolEmail,
        website_url: schoolDetails.schoolWebUrl,
        address_id: address.address_id,
      },
    });

    if (!result)
      return this.MicroserviceUtility.internalServerErrorReturn(
        'Failed saving changes',
      );

    return this.MicroserviceUtility.returnSuccess({
      message: 'Changes saved successfully',
    });
  }

  private baseSelect() {
    return {
      name: true,
      contact_number: true,
      school_id: true,
      email_address: true,
      website_url: true,
      address: {
        select: {
          address_line_1: true,
          street: {
            select: {
              street: true,
              district: {
                select: {
                  district: true,
                  municipality: {
                    select: {
                      municipality: true,
                      province: {
                        select: {
                          province: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }
}
