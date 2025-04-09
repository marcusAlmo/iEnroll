import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-account.dto';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { $Enums } from '@prisma/client';
import { AuthService } from 'libs/auth/auth.service';

@Injectable()
export class CreateAccountService {
  private genders = $Enums.gender;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

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

    if (userExists === 1) {
      throw this.createError(
        409,
        'ERR_USERNAME_EXISTS',
        'Username already exists',
      );
    }
    if (userExists === 2) {
      throw this.createError(409, 'ERR_EMAIL_EXISTS', 'Email already exists');
    }
    if (!schoolExists) {
      throw this.createError(
        404,
        'ERR_SCHOOL_NOT_FOUND',
        'School does not exist',
      );
    }
    // if (!addressExists) {
    //   throw this.createError(
    //     404,
    //     'ERR_ADDRESS_NOT_FOUND',
    //     'Address does not exist',
    //   );
    // }
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

      const createdAddress = await tx.address.create({
        data: {
          street: createUserDto.street,
          district: createUserDto.district,
          municipality: createUserDto.municipality,
        },
      });

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
            street: true,
            district: true,
            municipality: true,
          },
        },
        contact_number: true,
      },
      where: {
        is_active: true,
      },
    });
  }

  private parseGender(gender: 'M' | 'F' | 'O') {
    switch (gender) {
      case 'M':
        return this.genders.Male;
      case 'F':
        return this.genders.Female;
      case 'O':
        return this.genders.Other;
    }
  }

  private async checkIfUserExists(email: string, username: string) {
    const [usernameExists, emailExists] = await Promise.all([
      this.prisma.user.findFirst({ where: { username } }),
      this.prisma.user.findFirst({ where: { email_address: email } }),
    ]);

    if (usernameExists) return 1;
    if (emailExists) return 2;
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

  private createError(statusCode: number, errorCode: string, message: string) {
    return new BadRequestException({
      statusCode,
      error: errorCode,
      message,
    });
  }
}
