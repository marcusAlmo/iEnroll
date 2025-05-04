import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { SchoolDetails } from './interface/school-details.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Prisma } from '@prisma/client';

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
        schoolEmail: '',
        schoolWebUrl: '',
        schoolAddress: '',
        street: null,
        streetId: null,
        district: null,
        districtId: null,
        municipality: null,
        municipalityId: null,
        province: null,
        privinceId: null,
        schoolId: null,
      });

    return this.MicroserviceUtility.returnSuccess({
      schoolName: result.name,
      schoolContact: result.contact_number,
      schoolEmail: result.email_address,
      schoolWebUrl: result.website_url,
      schoolAddress: result.address.address_line_1,
      street: result.address.street.street,
      streetId: result.address.street.street_id,
      district: result.address.street.district.district,
      districtId: result.address.street.district.district_id,
      municipality: result.address.street.district.municipality.municipality,
      municipalityId:
        result.address.street.district.municipality.municipality_id,
      province: result.address.street.district.municipality.province.province,
      schoolId: result.school_id,
    });
  }

  public async saveSchoolDetails(
    schoolDetails: SchoolDetails['receiveInput'],
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const result1 = await this.updateAddress(
          schoolId,
          schoolDetails.streetId,
          schoolDetails.schoolAddress,
          prisma,
        );

        if (result1 !== 'Address updated successfully')
          throw new Error('Failed updating address');

        const result2 = await prisma.school.update({
          where: { school_id: schoolId },
          data: {
            name: schoolDetails.schoolName,
            contact_number: schoolDetails.schoolContact,
            email_address: schoolDetails.schoolEmail,
            website_url: schoolDetails.schoolWebUrl,
          },
        });

        if (!result2) throw new Error('Failed updating school');

        return 0;
      });

      if (result === 0)
        return this.MicroserviceUtility.returnSuccess({
          message: 'Changes saved successfully',
        });
    } catch (err) {
      if (err instanceof Error) {
        return this.MicroserviceUtility.internalServerErrorReturn(err.message);
      }
    }

    return this.MicroserviceUtility.returnSuccess({
      message: 'Changes saved successfully',
    });
  }

  public async getProvince(): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.retrieveProvince();
    return this.MicroserviceUtility.returnSuccess(result);
  }

  public async getMunicipality(
    provinceId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.retrieveMunicipality(provinceId);
    return this.MicroserviceUtility.returnSuccess(result);
  }

  public async getDistrict(
    municipalityId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.retrieveDistrict(municipalityId);
    return this.MicroserviceUtility.returnSuccess(result);
  }

  public async getStreet(
    districtId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result = await this.retrieveStreet(districtId);
    return this.MicroserviceUtility.returnSuccess(result);
  }

  // UTILITIES FUNCTION
  private async retrieveProvince(): Promise<SchoolDetails['province'][]> {
    const province = await this.prisma.province.findMany({
      select: {
        province_id: true,
        province: true,
      },
    });

    return province
      ? province.map((province) => ({
          provinceId: province.province_id,
          province: province.province,
        }))
      : [];
  }

  private async retrieveMunicipality(
    provinceId: number,
  ): Promise<SchoolDetails['municipality'][]> {
    const municipality = await this.prisma.municipality.findMany({
      select: {
        municipality_id: true,
        municipality: true,
      },
      where: {
        province_id: provinceId,
      },
    });

    return municipality
      ? municipality.map((municipality) => ({
          municipalityId: municipality.municipality_id,
          municipality: municipality.municipality,
        }))
      : [];
  }

  private async retrieveDistrict(
    municipalityId: number,
  ): Promise<SchoolDetails['district'][]> {
    const district = await this.prisma.district.findMany({
      select: {
        district_id: true,
        district: true,
      },
      where: {
        municipality_id: municipalityId,
      },
    });

    return district
      ? district.map((district) => ({
          districtId: district.district_id,
          district: district.district,
        }))
      : [];
  }

  private async retrieveStreet(
    districtId: number,
  ): Promise<SchoolDetails['street'][]> {
    const street = await this.prisma.street.findMany({
      select: {
        street_id: true,
        street: true,
      },
      where: {
        district_id: districtId,
      },
    });

    return street
      ? street.map((street) => ({
          streetId: street.street_id,
          street: street.street,
        }))
      : [];
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
              street_id: true,
              district: {
                select: {
                  district: true,
                  district_id: true,
                  municipality: {
                    select: {
                      municipality: true,
                      municipality_id: true,
                      province: {
                        select: {
                          province: true,
                          province_id: true,
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

  // for updating related tables
  private async updateAddress(
    schoolId: number,
    streetId: number,
    schoolAddress: string,
    prisma: Prisma.TransactionClient,
  ): Promise<string> {
    try {
      // First get the school with its address relation
      const school = await prisma.school.findUnique({
        where: { school_id: schoolId },
        select: { address_id: true },
      });

      if (!school?.address_id) {
        return 'School address not found';
      }

      // Update using the explicit address_id
      await prisma.address.update({
        where: { address_id: school.address_id },
        data: {
          street_id: streetId,
          address_line_1: schoolAddress,
        },
      });

      return 'Address updated successfully';
    } catch (error) {
      console.error('Error updating address:', error);
      return 'Failed updating address';
    }
  }
}
