import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EnrollService } from './enroll.service';
import {
  PaymentDto,
  RequirementPayloadDto,
} from '@lib/dtos/src/enrollment/v1/enroll.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@lib/decorators/user.decorator';
import { MultipleDynamicFileInterceptor } from './interceptors/multiple-file-dynamic.interceptor';

@Controller('enroll')
@UseGuards(JwtAuthGuard)
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Get('school-selection')
  async getSchoolLevelAndScheduleSelection(
    @Query('school_id', ParseIntPipe) schoolId: number,
  ) {
    return await this.enrollService.getSchoolLevelAndScheduleSelection({
      id: schoolId,
    });
  }

  @Get('requirements')
  async getAllGradeSectionTypeRequirements(
    @Query('grade_section_program_id', ParseIntPipe)
    gradeSectionProgramId: number,
  ) {
    return await this.enrollService.getAllGradeSectionTypeRequirements({
      id: gradeSectionProgramId,
    });
  }

  @Get('payment')
  async getPaymentMethodDetails(
    @Query('grade_section_program_id', ParseIntPipe)
    gradeSectionProgramId: number,
  ) {
    return await this.enrollService.getPaymentMethodDetails({
      id: gradeSectionProgramId,
    });
  }

  @Post('payment')
  @UseInterceptors(FileInterceptor('file'))
  async submitPayment(
    @Body() paymentDto: PaymentDto,
    @UploadedFile() file: Express.Multer.File,
    @User('user_id') studentId: number,
  ) {
    if (!file) throw new BadRequestException('File upload not found!');
    return await this.enrollService.submitPayment({
      file,
      paymentOptionId: paymentDto.paymentOptionId,
      studentId: studentId,
    });
  }

  @Post('requirements')
  @UseInterceptors(
    FilesInterceptor('files'),
    new MultipleDynamicFileInterceptor(),
  )
  async submitRequirements(
    @Body() body: RequirementPayloadDto,
    @User('user_id') studentId: number,
  ) {
    const allRequirementIds = body.payloads.map((p) => p.requirementId);

    if (
      !(await this.enrollService.checkIfAllRequirementIdsAreValid(
        allRequirementIds,
      ))
    ) {
      throw new BadRequestException('Not all requirement ids are valid');
    }

    const result = await this.enrollService.submitRequirements({
      payloads: body.payloads,
      studentId,
    });

    return result;
  }
}
