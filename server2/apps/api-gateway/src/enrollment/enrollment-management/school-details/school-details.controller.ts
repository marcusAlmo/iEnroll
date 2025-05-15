import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SchoolDetailsService } from './school-details.service';
import { User } from '@lib/decorators/user.decorator';
import { SchoolDetails } from './dto/school-details.dto';

@Controller('school-details')
export class SchoolDetailsController {
  constructor(private readonly schoolDetailsService: SchoolDetailsService) {}

  @Get('retrieve')
  async getSchoolDetails(@User('school_id') schoolId: number) {
    return await this.schoolDetailsService.getSchoolDetails({ schoolId });
  }

  @Post('save')
  async saveSchoolDetails(
    @User('school_id') schoolId: number,
    @Body() schoolDetails: SchoolDetails,
  ) {
    return await this.schoolDetailsService.saveSchoolDetails({
      schoolDetails,
      schoolId,
    });
  }

  @Get('province')
  async getProvince() {
    return await this.schoolDetailsService.getProvince();
  }

  @Get('municipality/:provinceId')
  async getMunicipality(@Param('provinceId') provinceId: string) {
    const id: number = Number(provinceId);
    return await this.schoolDetailsService.getMunicipality({ provinceId: id });
  }

  @Get('district/:municipalityId')
  async getDistrict(@Param('municipalityId') municipalityId: string) {
    const id: number = Number(municipalityId);
    return await this.schoolDetailsService.getDistrict({ municipalityId: id });
  }

  @Get('street/:districtId')
  async getStreet(@Param('districtId') districtId: string) {
    const id: number = Number(districtId);
    return await this.schoolDetailsService.getStreet({ districtId: id });
  }
}
