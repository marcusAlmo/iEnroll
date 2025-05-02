import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { $Enums } from '@prisma/client';
import { AuthService } from '@lib/auth/auth.service';
import { UserExists } from './enums/user-exists.enum';
import { RpcException } from '@nestjs/microservices';
import { Transaction } from '@lib/prisma/src/types/Transaction';

@Injectable()
export class CreateAccountService {
  private genders = $Enums.gender;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private async createProvince(tx: Transaction, province: string) {
    return await tx.province.create({
      data: {
        province,
        is_default: false,
      },
    });
  }

  private async createMunicipality(
    tx: Transaction,
    municipality: string,
    provinceId: number,
  ) {
    return await tx.municipality.create({
      data: {
        municipality,
        province_id: provinceId,
        is_default: false,
      },
    });
  }

  private async createDistrict(
    tx: Transaction,
    district: string,
    municipalityId: number,
  ) {
    return await tx.district.create({
      data: {
        district,
        municipality_id: municipalityId,
        is_default: false,
      },
    });
  }

  private async createStreet(
    tx: Transaction,
    street: string,
    districtId: number,
  ) {
    return await tx.street.create({
      data: {
        street,
        district_id: districtId,
        is_default: false,
      },
    });
  }

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
    const streetName = `${
      payload.street
        ? payload.street
        : (await tx.street.findFirst({
            select: { street: true },
            where: { street_id: payload.streetId },
          }))!.street
    }`;
    const districtName = `${
      payload.district
        ? payload.district
        : (await tx.district.findFirst({
            select: { district: true },
            where: { district_id: payload.districtId },
          }))!.district
    }`;
    const municipalityName = `${
      payload.municipality
        ? payload.municipality
        : (await tx.municipality.findFirst({
            select: { municipality: true },
            where: { municipality_id: payload.municipalityId },
          }))!.municipality
    }`;
    const provinceName = `${
      payload.province
        ? payload.province
        : (await tx.province.findFirst({
            select: { province: true },
            where: { province_id: payload.districtId },
          }))!.province
    }`;

    return await tx.address.create({
      data: {
        address_line_1: [
          `${streetName} ${districtName}`.trim(),
          municipalityName.trim(),
          provinceName.trim(),
        ].join(', '),
        street_id: payload.streetId,
      },
    });
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
      const province = await this.createProvince(tx, createUserDto.province);
      const municipality = await this.createMunicipality(
        tx,
        createUserDto.municipality,
        province.province_id,
      );
      const district = await this.createDistrict(
        tx,
        createUserDto.district,
        municipality.municipality_id,
      );
      const street = await this.createStreet(
        tx,
        createUserDto.street,
        district.district_id,
      );

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
      const municipality = await this.createMunicipality(
        tx,
        createUserDto.municipality,
        createUserDto.provinceId,
      );
      const district = await this.createDistrict(
        tx,
        createUserDto.district,
        municipality.municipality_id,
      );
      const street = await this.createStreet(
        tx,
        createUserDto.street,
        district.district_id,
      );

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
      const district = await this.createDistrict(
        tx,
        createUserDto.district,
        createUserDto.municipalityId,
      );
      const street = await this.createStreet(
        tx,
        createUserDto.street,
        district.district_id,
      );

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
      const street = await this.createStreet(
        tx,
        createUserDto.street,
        createUserDto.districtId,
      );

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

  async getAllProvinces() {
    return this.prisma.province.findMany({
      select: {
        province_id: true,
        province: true,
      },
    });
  }

  async getAllMunicipalitiesByProvinceId(provinceId: number) {
    return this.prisma.municipality.findMany({
      select: {
        municipality_id: true,
        municipality: true,
      },
      where: {
        province_id: provinceId,
      },
    });
  }

  async getAllDistrictsByMunicipalityId(municipalityId: number) {
    return this.prisma.district.findMany({
      select: {
        district_id: true,
        district: true,
      },
      where: {
        municipality_id: municipalityId,
      },
    });
  }

  async getAllStreetsByDistrictId(districtId: number) {
    return this.prisma.street.findMany({
      select: {
        street_id: true,
        street: true,
      },
      where: {
        district_id: districtId,
      },
    });
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
