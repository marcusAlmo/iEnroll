import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateUserDto) {
    return await this.createAccountService.create(createAccountDto);
  }

  @Get('school')
  async getAllAvailableSchools() {
    return await this.createAccountService.getAllSchools();
  }

  @Get('address')
  async getAllAddresses() {
    return await this.createAccountService.getAlAddresses();
  }

  @Get('address/province')
  async getAllProvinces() {
    return await this.createAccountService.getAllProvinces();
  }

  @Get('address/municipality/:provinceId')
  async getAllMunicipalitiesByProvinceId(
    @Param('provinceId') provinceId: number,
  ) {
    return await this.createAccountService.getAllMunicipalitiesByProvinceId(
      provinceId,
    );
  }

  @Get('address/district/:municipalityId')
  async getAllDistrictsByMunicipalityId(
    @Param('municipalityId') municipalityId: number,
  ) {
    return await this.createAccountService.getAllDistrictsByMunicipalityId(
      municipalityId,
    );
  }

  @Get('address/street/:districtId')
  async getAllStreetsByDistrictId(@Param('districtId') districtId: number) {
    return await this.createAccountService.getAllStreetsByDistrictId(
      districtId,
    );
  }
}
