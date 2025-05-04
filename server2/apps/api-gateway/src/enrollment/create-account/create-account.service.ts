import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateReturn,
  GetAllAddressesReturn,
  GetAllDistrictsByMunicipalityIdReturn,
  GetAllMunicipalitiesByProvinceIdReturn,
  GetAllProvincesReturn,
  GetAllSchoolsReturn,
  GetAllStreetsByDistrictIdReturn,
} from './create-account.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(payload: object) {
    const result: CreateReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'create_account',
        },
        payload,
      ),
    );
    return result;
  }

  async getAllSchools() {
    const result: GetAllSchoolsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_schools',
        },
        {},
      ),
    );
    return result;
  }

  async getAlAddresses() {
    const result: GetAllAddressesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_addresses',
        },
        {},
      ),
    );
    return result;
  }

  async getAllProvinces() {
    const result: GetAllProvincesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_provinces',
        },
        {},
      ),
    );
    return result;
  }

  async getAllMunicipalitiesByProvinceId(provinceId: number) {
    const result: GetAllMunicipalitiesByProvinceIdReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_municipalities_by_province_id',
        },
        { provinceId },
      ),
    );
    return result;
  }

  async getAllDistrictsByMunicipalityId(municipalityId: number) {
    const result: GetAllDistrictsByMunicipalityIdReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_districts_by_municipality_id',
        },
        { municipalityId },
      ),
    );
    return result;
  }

  async getAllStreetsByDistrictId(districtId: number) {
    const result: GetAllStreetsByDistrictIdReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_all_streets_by_district_id',
        },
        { districtId },
      ),
    );
    return result;
  }
}
