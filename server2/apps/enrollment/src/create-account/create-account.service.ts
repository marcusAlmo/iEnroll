import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-account.dto';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { $Enums } from '@prisma/client';
import { AuthService } from 'libs/auth/auth.service';
@Injectable()
export class CreateAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (this.checkIfSchoolExists(createUserDto.schoolId)) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'ERR_SCHOOL_NOT_FOUND',
        message: 'School does not exist',
      });
    }
    if (this.checkIfAddressExists(createUserDto.addressId)) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'ERR_ADDRESS_NOT_FOUND',
        message: 'Address does not exist',
      });
    }
    if (this.checkIfUserExists(createUserDto.email, createUserDto.username)) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'ERR_USER_ALREADY_EXISTS',
        message: 'User already exists',
      });
    }
    if (
      createUserDto.enrollerId &&
      this.checkIfEnrollerExists(createUserDto.enrollerId)
    ) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'ERR_ENROLLEE_NOT_FOUND',
        message: 'Enrollee does not exist',
      });
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

      await tx.student.create({
        data: {
          birthdate: createUserDto.dateOfBirth,
          address_id: createUserDto.addressId,
          student_id: createdUser.user_id,
          enroller_id: createUserDto.enrollerId
            ? createUserDto.enrollerId
            : createdUser.user_id,
        },
      });
    });
  }

  private parseGender(gender: 'M' | 'F') {
    switch (gender) {
      case 'F':
        return $Enums.gender.Female;
      case 'M':
        return $Enums.gender.Male;
    }
  }

  private checkIfUserExists(email: string, username: string) {
    return Boolean(
      this.prisma.user.findFirst({
        where: {
          email_address: email,
          username,
        },
      }),
    );
  }

  private checkIfSchoolExists(schoolId: number) {
    return Boolean(
      this.prisma.school.findFirst({
        where: {
          school_id: schoolId,
        },
      }),
    );
  }

  private checkIfAddressExists(addressId: number) {
    return Boolean(
      this.prisma.address.findFirst({
        where: {
          address_id: addressId,
        },
      }),
    );
  }

  private checkIfEnrollerExists(enrollerId: number) {
    return Boolean(
      this.prisma.user.findFirst({
        where: {
          user_id: enrollerId,
        },
      }),
    );
  }
}
