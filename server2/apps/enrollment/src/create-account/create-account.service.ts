import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { $Enums } from '@prisma/client';
import { AuthService } from '@lib/auth/auth.service';
import { UserExists } from './enums/user-exists.enum';
import { RpcException } from '@nestjs/microservices';
import { Transaction } from '@lib/prisma/src/types/Transaction';
import { AddressService } from '@lib/address';

@Injectable()
export class CreateAccountService {
  private genders = $Enums.gender;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly addressService: AddressService,
  ) {}

  private async createAddress(
    tx: Transaction,
    payload: {
      streetId: number;
      street?: string;
      districtId?: number;
      district?: string;
      municipalityId?: number;
      municipality?: string;
      provinceId?: number;
      province?: string;
    },
  ) {
    let streetName = payload.street;
    let districtName = payload.district;
    let municipalityName = payload.municipality;
    let provinceName = payload.province;

    if (!streetName) {
      const streetResult = await this.addressService.getStreetNameByStreetId(
        payload.streetId,
        tx,
      );

      if (!streetResult.success) {
        throw new RpcException({
          statusCode: 500,
          error: streetResult.code,
        });
      }

      streetName = streetResult.data.street;
    }

    if (!districtName) {
      if (!payload.districtId) {
        throw new RpcException({
          statusCode: 400,
          error: 'District ID is required when district name is not provided',
        });
      }

      const districtResult =
        await this.addressService.getDistrictNameByDistrictId(
          payload.districtId,
          tx,
        );

      if (!districtResult.success) {
        throw new RpcException({
          statusCode: 500,
          error: districtResult.code,
        });
      }

      districtName = districtResult.data.district;
    }

    if (!municipalityName) {
      if (!payload.municipalityId) {
        throw new RpcException({
          statusCode: 400,
          error:
            'Municipality ID is required when municipality name is not provided',
        });
      }

      const municipalityResult =
        await this.addressService.getMunicipalityNameByMunicipalityId(
          payload.municipalityId,
          tx,
        );

      if (!municipalityResult.success) {
        throw new RpcException({
          statusCode: 500,
          error: municipalityResult.code,
        });
      }

      municipalityName = municipalityResult.data.municipality;
    }

    if (!provinceName) {
      if (!payload.provinceId) {
        throw new RpcException({
          statusCode: 400,
          error: 'Province ID is required when province name is not provided',
        });
      }

      const provinceResult =
        await this.addressService.getProvinceNameByProvinceId(
          payload.provinceId,
          tx,
        );

      if (!provinceResult.success) {
        throw new RpcException({
          statusCode: 500,
          error: provinceResult.code,
        });
      }

      provinceName = provinceResult.data.province;
    }

    const addressLine = this.addressService.formatAddressLineName({
      street: streetName,
      district: districtName,
      municipality: municipalityName,
      province: provinceName,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.addressService.createAddress(
      {
        addressLine,
        streetId: payload.streetId,
      },
      tx,
    );
  }

  private async createFullAddress(
    tx: Transaction,
    createUserDto: CreateUserDto,
  ) {
    if (
      createUserDto.street &&
      createUserDto.district &&
      createUserDto.municipality &&
      createUserDto.province
    ) {
      const province = await this.addressService.createProvince(
        {
          province: createUserDto.province,
        },
        tx,
      );
      const municipality = await this.addressService.createMunicipality(
        {
          municipality: createUserDto.municipality,
          provinceId: province.province_id,
        },
        tx,
      );
      const district = await this.addressService.createDistrict(
        {
          district: createUserDto.district,
          municipalityId: municipality.municipality_id,
        },
        tx,
      );
      const street = await this.addressService.createStreet(
        {
          street: createUserDto.street,
          districtId: district.district_id,
        },
        tx,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.createAddress(tx, {
        streetId: street.street_id,
        street: createUserDto.street,
        district: createUserDto.district,
        municipality: createUserDto.municipality,
        province: createUserDto.province,
      });
    } else if (
      createUserDto.street &&
      createUserDto.district &&
      createUserDto.municipality &&
      createUserDto.provinceId
    ) {
      const province = await this.addressService.getProvinceNameByProvinceId(
        createUserDto.provinceId,
        tx,
      );

      if (!province.success)
        throw new RpcException({
          statusCode: 400,
          error: province.code,
        });

      const municipality = await this.addressService.createMunicipality(
        {
          municipality: createUserDto.municipality,
          provinceId: createUserDto.provinceId,
        },
        tx,
      );
      const district = await this.addressService.createDistrict(
        {
          district: createUserDto.district,
          municipalityId: municipality.municipality_id,
        },
        tx,
      );
      const street = await this.addressService.createStreet(
        {
          street: createUserDto.street,
          districtId: district.district_id,
        },
        tx,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.createAddress(tx, {
        streetId: street.street_id,
        street: createUserDto.street,
        district: createUserDto.district,
        municipality: createUserDto.municipality,
        provinceId: createUserDto.provinceId,
      });
    } else if (
      createUserDto.street &&
      createUserDto.district &&
      createUserDto.municipalityId &&
      createUserDto.provinceId
    ) {
      const municipality =
        await this.addressService.getMunicipalityNameByMunicipalityId(
          createUserDto.municipalityId,
          tx,
        );

      if (!municipality.success)
        throw new RpcException({
          statusCode: 400,
          error: municipality.code,
        });

      const district = await this.addressService.createDistrict(
        {
          district: createUserDto.district,
          municipalityId: createUserDto.municipalityId,
        },
        tx,
      );
      const street = await this.addressService.createStreet(
        {
          street: createUserDto.street,
          districtId: district.district_id,
        },
        tx,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.createAddress(tx, {
        streetId: street.street_id,
        street: createUserDto.street,
        district: createUserDto.district,
        municipalityId: createUserDto.municipalityId,
        provinceId: createUserDto.provinceId,
      });
    } else if (
      createUserDto.street &&
      createUserDto.districtId &&
      createUserDto.municipalityId &&
      createUserDto.provinceId
    ) {
      const district = await this.addressService.getDistrictNameByDistrictId(
        createUserDto.districtId,
        tx,
      );

      if (!district.success)
        throw new RpcException({
          statusCode: 400,
          error: district.code,
        });

      const street = await this.addressService.createStreet(
        {
          street: createUserDto.street,
          districtId: createUserDto.districtId,
        },
        tx,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.createAddress(tx, {
        streetId: street.street_id,
        street: createUserDto.street,
        districtId: createUserDto.districtId,
        municipalityId: createUserDto.municipalityId,
        provinceId: createUserDto.provinceId,
      });
    } else if (
      createUserDto.streetId &&
      createUserDto.districtId &&
      createUserDto.municipalityId &&
      createUserDto.provinceId
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.createAddress(tx, {
        streetId: createUserDto.streetId,
        street: createUserDto.street,
        districtId: createUserDto.districtId,
        municipalityId: createUserDto.municipalityId,
        provinceId: createUserDto.provinceId,
      });
    } else throw new Error('Invalid data');
  }

  async create(createUserDto: CreateUserDto) {
    // prettier-ignore
    const [userExists, schoolExists /* addressExists */ 
      , enrollerExists] =
      await Promise.all([
        this.checkIfUserExists(createUserDto.email, createUserDto.username),
        this.checkIfSchoolExists(createUserDto.schoolId),
        // this.checkIfAddressExists(createUserDto.addressId),
        this.checkIfEnrollerExists(createUserDto.enrollerId),
      ]);

    if (userExists === UserExists.USERNAME_EXISTS) {
      throw this.createError(
        409,
        'ERR_USERNAME_EXISTS',
        'Username already exists',
      );
    }
    if (userExists === UserExists.EMAIL_EXISTS) {
      throw this.createError(409, 'ERR_EMAIL_EXISTS', 'Email already exists');
    }
    if (!schoolExists) {
      throw this.createError(
        404,
        'ERR_SCHOOL_NOT_FOUND',
        'School does not exist',
      );
    }
    if (createUserDto.enrollerId && !enrollerExists) {
      throw this.createError(
        404,
        'ERR_ENROLLEE_NOT_FOUND',
        'Enrollee does not exist',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          first_name: createUserDto.firstName,
          middle_name: createUserDto.middleName,
          last_name: createUserDto.lastName,
          suffix: createUserDto.suffix,
          gender: this.parseGender(createUserDto.gender),
          email_address: createUserDto.email,
          password_hash: await this.authService.hashPassword(
            createUserDto.password,
          ),
          username: createUserDto.username,
          contact_number: createUserDto.contactNumber,
          school_id: createUserDto.schoolId,
        },
      });

      const createdAddress = await this.createFullAddress(tx, createUserDto);

      await tx.student.create({
        data: {
          birthdate: createUserDto.dateOfBirth,
          address_id: createdAddress.address_id,
          student_id: createdUser.user_id,
          enroller_id: createUserDto.enrollerId ?? createdUser.user_id,
        },
      });
    });

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }

  async getAllSchools() {
    return this.prisma.school.findMany({
      select: {
        school_id: true,
        name: true,
        address: {
          select: {
            address_line_1: true,
          },
        },
        contact_number: true,
      },
      where: {
        is_active: true,
      },
    });
  }

  async getAllAddresses() {
    const result = await this.prisma.province.findMany({
      select: {
        province: true,
        province_id: true,
        municipality: {
          select: {
            municipality_id: true,
            municipality: true,
            district: {
              select: {
                district_id: true,
                district: true,
                street: {
                  select: {
                    street_id: true,
                    street: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result.map((provinceItem) => ({
      provinceId: provinceItem.province_id,
      province: provinceItem.province,
      municipalities: provinceItem.municipality.map((municipalityItem) => ({
        municipalityId: municipalityItem.municipality_id,
        municipality: municipalityItem.municipality,
        districts: municipalityItem.district.map((districtItem) => ({
          districtId: districtItem.district_id,
          district: districtItem.district,
          streets: districtItem.street.map((streetItem) => ({
            streetId: streetItem.street_id,
            street: streetItem.street,
          })),
        })),
      })),
    }));
  }

  private parseGender(gender: 'M' | 'F' | 'O') {
    switch (gender) {
      case 'M':
        return this.genders.male;
      case 'F':
        return this.genders.female;
      case 'O':
        return this.genders.other;
    }
  }

  private async checkIfUserExists(email: string, username: string) {
    const [usernameExists, emailExists] = await Promise.all([
      this.prisma.user.findFirst({ where: { username } }),
      this.prisma.user.findFirst({ where: { email_address: email } }),
    ]);

    if (usernameExists) return UserExists.USERNAME_EXISTS;
    if (emailExists) return UserExists.EMAIL_EXISTS;
    return 0;
  }

  private async checkIfSchoolExists(schoolId: number) {
    const school = await this.prisma.school.findFirst({
      where: { school_id: schoolId, is_active: true },
    });
    return Boolean(school);
  }

  // private async checkIfAddressExists(addressId: number) {
  //   const address = await this.prisma.address.findFirst({
  //     where: { address_id: addressId },
  //   });
  //   return Boolean(address);
  // }

  private async checkIfEnrollerExists(enrollerId?: number) {
    if (!enrollerId) return true; // No enrollerId to check
    const enroller = await this.prisma.user.findFirst({
      where: { user_id: enrollerId },
    });
    return Boolean(enroller);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private createError(statusCode: number, errorCode: string, message: string) {
    return new RpcException({
      statusCode,
      message: errorCode,
      // message,
    });
  }
}
