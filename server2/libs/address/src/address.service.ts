import { PrismaService } from '@lib/prisma/src/prisma.service';
import { PrismaClientOrTransaction } from '@lib/prisma/src/types/PrismaClientOrTransaction';
import { Injectable } from '@nestjs/common';

/**
 * Service for managing addresses, including CRUD operations for provinces, municipalities,
 * districts, streets, and addresses. Provides utility methods for formatting and retrieving
 * address-related data.
 */
@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Formats an address line name by combining street, district, municipality, and province.
   *
   * @param params - Object containing the components of the address.
   * @param params.street - The street name.
   * @param params.district - The district name.
   * @param params.municipality - The municipality name.
   * @param params.province - The province name.
   * @returns The formatted address line name.
   */
  formatAddressLineName({
    street,
    district,
    municipality,
    province,
  }: {
    street: string;
    district: string;
    municipality: string;
    province: string;
  }) {
    return (
      `${street} ${district}`.trim() +
      ', ' +
      municipality.trim() +
      ', ' +
      province.trim()
    );
  }

  /**
   * Retrieves the full address by a given street ID.
   *
   * @param streetId - The ID of the street.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns An object containing the success status and either the full address or an error code.
   */
  async getFullAddressByStreetId(
    streetId: number,
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    const result = await refPrisma.street.findFirst({
      where: { street_id: streetId },
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
    });

    if (!result) {
      return {
        success: false,
        code: 'ERR_STREET_NOT_FOUND',
      } as const;
    }

    const fullAddress = this.formatAddressLineName({
      street: result.street,
      district: result.district.district,
      municipality: result.district.municipality.municipality,
      province: result.district.municipality.province.province,
    });

    return {
      success: true,
      data: {
        fullAddress,
      },
    } as const;
  }

  /**
   * Creates a new address.
   *
   * @param payload - Object containing the address details.
   * @param payload.addressLine - The address line.
   * @param payload.streetId - The ID of the street.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns The created address record.
   */
  async createAddress(
    payload: {
      addressLine: string;
      streetId: number;
    },
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    return await refPrisma.address.create({
      data: {
        address_line_1: payload.addressLine,
        street_id: payload.streetId,
      },
    });
  }

  /**
   * Creates a new province.
   *
   * @param payload - Object containing the province details.
   * @param payload.province - The name of the province.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns The created province record.
   */
  async createProvince(
    payload: {
      province: string;
    },
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    const existingProvince = await refPrisma.province.findFirst({
      where: {
        province: {
          mode: 'insensitive',
          equals: payload.province,
        },
      },
    });
    if (existingProvince) return existingProvince;
    return await refPrisma.province.create({
      data: {
        province: payload.province,
        is_default: false,
      },
    });
  }

  /**
   * Creates a new municipality.
   *
   * @param payload - Object containing the municipality details.
   * @param payload.municipality - The name of the municipality.
   * @param payload.provinceId - The ID of the associated province.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns The created municipality record.
   */
  async createMunicipality(
    payload: {
      municipality: string;
      provinceId: number;
    },
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    const existingMunicipality = await refPrisma.municipality.findFirst({
      where: {
        municipality: {
          mode: 'insensitive',
          equals: payload.municipality,
        },
        province_id: payload.provinceId,
      },
    });
    if (existingMunicipality) return existingMunicipality;
    return await refPrisma.municipality.create({
      data: {
        municipality: payload.municipality,
        province_id: payload.provinceId,
        is_default: false,
      },
    });
  }

  /**
   * Creates a new district.
   *
   * @param payload - Object containing the district details.
   * @param payload.district - The name of the district.
   * @param payload.municipalityId - The ID of the associated municipality.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns The created district record.
   */
  async createDistrict(
    payload: {
      district: string;
      municipalityId: number;
    },
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    const existingDistrict = await refPrisma.district.findFirst({
      where: {
        district: {
          mode: 'insensitive',
          equals: payload.district,
        },
        municipality_id: payload.municipalityId,
      },
    });
    if (existingDistrict) return existingDistrict;

    return await refPrisma.district.create({
      data: {
        district: payload.district,
        municipality_id: payload.municipalityId,
        is_default: false,
      },
    });
  }

  /**
   * Creates a new street.
   *
   * @param payload - Object containing the street details.
   * @param payload.street - The name of the street.
   * @param payload.districtId - The ID of the associated district.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns The created street record.
   */
  async createStreet(
    payload: {
      street: string;
      districtId: number;
    },
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;
    const existingStreet = await refPrisma.street.findFirst({
      where: {
        street: {
          mode: 'insensitive',
          equals: payload.street,
        },
        district_id: payload.districtId,
      },
    });
    if (existingStreet) return existingStreet;
    return await refPrisma.street.create({
      data: {
        street: payload.street,
        district_id: payload.districtId,
        is_default: false,
      },
    });
  }

  /**
   * Retrieves the name of a street by its ID.
   *
   * @param streetId - The ID of the street.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns An object containing the success status and either the street name or an error code.
   */
  async getStreetNameByStreetId(
    streetId: number,
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;

    const street = await refPrisma.street.findFirst({
      select: { street: true },
      where: { street_id: streetId },
    });

    if (!street)
      return {
        success: false,
        code: 'ERR_STREET_NOT_FOUND',
      } as const;

    return {
      success: true,
      data: {
        street: street.street,
      },
    } as const;
  }

  /**
   * Retrieves the name of a district by its ID.
   *
   * @param districtId - The ID of the district.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns An object containing the success status and either the district name or an error code.
   */
  async getDistrictNameByDistrictId(
    districtId: number,
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;

    const district = await refPrisma.district.findFirst({
      select: { district: true },
      where: { district_id: districtId },
    });

    if (!district)
      return {
        success: false,
        code: 'ERR_DISTRICT_NOT_FOUND',
      } as const;

    return {
      success: true,
      data: {
        district: district.district,
      },
    } as const;
  }

  /**
   * Retrieves the name of a municipality by its ID.
   *
   * @param municipalityId - The ID of the municipality.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns An object containing the success status and either the municipality name or an error code.
   */
  async getMunicipalityNameByMunicipalityId(
    municipalityId: number,
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;

    const municipality = await refPrisma.municipality.findFirst({
      select: { municipality: true },
      where: { municipality_id: municipalityId },
    });

    if (!municipality)
      return {
        success: false,
        code: 'ERR_MUNICIPALITY_NOT_FOUND',
      } as const;

    return {
      success: true,
      data: {
        municipality: municipality.municipality,
      },
    } as const;
  }

  /**
   * Retrieves the name of a province by its ID.
   *
   * @param provinceId - The ID of the province.
   * @param prisma - Optional Prisma client or transaction instance.
   * @returns An object containing the success status and either the province name or an error code.
   */
  async getProvinceNameByProvinceId(
    provinceId: number,
    prisma?: PrismaClientOrTransaction,
  ) {
    const refPrisma = prisma ?? this.prisma;

    const province = await refPrisma.province.findFirst({
      select: { province: true },
      where: { province_id: provinceId },
    });

    if (!province) {
      return {
        success: false,
        code: 'ERR_PROVINCE_NOT_FOUND',
      } as const;
    }

    return {
      success: true,
      data: {
        province: province.province,
      },
    } as const;
  }
}
