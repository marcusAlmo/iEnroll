import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SchoolDetailsService } from './school-details.service';
import { SchoolDetails } from './interface/school-details.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Controller('school-details')
export class SchoolDetailsController {
  constructor(private readonly schoolDetailsService: SchoolDetailsService) {}

  @MessagePattern({ cmd: 'retrieve-schoool-details' })
  async getSchoolDetails(payload: { schoolId: number }) {
    return await this.schoolDetailsService.getSchoolDetails(payload.schoolId);
  }

  @MessagePattern({ cmd: 'save-school-details' })
  async saveSchoolDetails(payload: {
    schoolDetails: SchoolDetails['receiveInput'];
    schoolId: number;
  }) {
    return await this.schoolDetailsService.saveSchoolDetails(
      payload.schoolDetails,
      payload.schoolId,
    );
  }

  @MessagePattern({ cmd: 'get-province' })
  async getProvince(): Promise<MicroserviceUtility['returnValue']> {
    return await this.schoolDetailsService.getProvince();
  }

  @MessagePattern({ cmd: 'get-municipality' })
  async getMunicipality(payload: {
    provinceId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return await this.schoolDetailsService.getMunicipality(payload.provinceId);
  }

  @MessagePattern({ cmd: 'get-district' })
  async getDistrict(payload: {
    municipalityId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return await this.schoolDetailsService.getDistrict(payload.municipalityId);
  }

  @MessagePattern({ cmd: 'get-street' })
  async getStreet(payload: {
    districtId: number;
  }): Promise<MicroserviceUtility['returnValue']> {
    return await this.schoolDetailsService.getStreet(payload.districtId);
  }
}
