import { Controller } from '@nestjs/common';
import { CreateUserDto } from '@lib/dtos/src/enrollment/v1/create-account.dto';
import { CreateAccountService } from './create-account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('create-account')
export class CreateAccountController {
  constructor(private readonly usersService: CreateAccountService) {}

  @MessagePattern({ cmd: 'create_account' })
  async create(@Payload() createUserDto: CreateUserDto) {
    console.debug('Received payload:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_all_schools' })
  async getAllSchools() {
    return this.usersService.getAllSchools();
  }

  @MessagePattern({ cmd: 'get_all_addresses' })
  async getAllAddresses() {
    return this.usersService.getAllAddresses();
  }

  @MessagePattern({ cmd: 'get_all_provinces' })
  async getAllProvinces() {
    return this.usersService.getAllProvinces();
  }

  @MessagePattern({ cmd: 'get_all_municipalities_by_province_id' })
  async getAllMunicipalitiesByProvinceId(
    @Payload() payload: { provinceId: number },
  ) {
    return this.usersService.getAllMunicipalitiesByProvinceId(
      payload.provinceId,
    );
  }

  @MessagePattern({ cmd: 'get_all_districts_by_municipality_id' })
  async getAllDistrictsByMunicipalityId(
    @Payload() payload: { municipalityId: number },
  ) {
    return this.usersService.getAllMunicipalitiesByProvinceId(
      payload.municipalityId,
    );
  }

  @MessagePattern({ cmd: 'get_all_streets_by_district_id' })
  async getAllStreetsByDistrictId(@Payload() payload: { districtId: number }) {
    return this.usersService.getAllStreetsByDistrictId(payload.districtId);
  }
}
