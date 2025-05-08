import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
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
import {
  EnrollmentApplicationDtoHttp,
  RequirementTextDto,
  RequirementFileDto,
  DetailsDtoHttp,
  RequirementFileDtoHttp,
  RequirementTextDtoHttp,
  PaymentDtoHttp,
} from '@lib/dtos/src/enrollment/v1/microservice/enroll.dto';

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

  @Get('selection/academic-levels')
  async getAcademicLevelsBySchool(@User('school_id') schoolId: number) {
    return await this.enrollService.getAcademicLevelsBySchool({
      schoolId,
    });
  }

  @Get('selection/grade-levels/:academicLevelCode')
  async getGradeLevelsByAcademicLevel(
    @Param('academicLevelCode') academicLevelCode: string,
    @User('school_id') schoolId: number,
  ) {
    return await this.enrollService.getGradeLevelsByAcademicLevel({
      academicLevelCode,
      schoolId,
    });
  }

  @Get('selection/schedules/:gradeLevelCode')
  async getSchedulesByGradeLevel(
    @Param('gradeLevelCode') gradeLevelCode: string,
  ) {
    return await this.enrollService.getSchedulesByGradeLevel({
      gradeLevelCode,
    });
  }

  @Get('selection/section-types/:gradeLevelCode')
  async getGradeSectionTypesByGradeLevel(
    @Param('gradeLevelCode') gradeLevelCode: string,
  ) {
    return await this.enrollService.getGradeSectionTypesByGradeLevel({
      gradeLevelCode,
    });
  }

  @Get('selection/sections/:gradeLevelCode')
  async getSectionsByGradeLevel(
    @Param('gradeLevelCode') gradeLevelCode: string,
  ) {
    return await this.enrollService.getSectionsByGradeLevel({
      gradeLevelCode,
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
    @User('school_id') schoolId: number,
  ) {
    if (!file) throw new BadRequestException('File upload not found!');
    return await this.enrollService.submitPayment({
      file,
      paymentOptionId: paymentDto.paymentOptionId,
      studentId,
      schoolId,
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
    @User('school_id') schoolId: number,
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
      schoolId,
    });

    return result;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async enrollStudent(
    @Body() body: EnrollmentApplicationDtoHttp,
    @UploadedFiles() files: Express.Multer.File[],
    @User('user_id') studentId: number,
    @User('school_id') schoolId: number,
  ) {
    if (!files?.length) {
      throw new BadRequestException('ERR_FILES_NOT_FOUND');
    }

    const uploadedFiles = await Promise.all(
      files.map((file) =>
        this.enrollService.uploadFile(file, studentId, schoolId),
      ),
    );

    const failedUpload = uploadedFiles.find((res) => !res.success);
    if (failedUpload) {
      throw new InternalServerErrorException('ERR_FILE_UPLOAD_UNSUCCESSFUL');
    }

    const {
      details: detailsRaw,
      requirements: requirementsRaw,
      payment: paymentRaw,
    } = body;

    const details = JSON.parse(detailsRaw) as DetailsDtoHttp;
    const requirements = JSON.parse(requirementsRaw) as (
      | RequirementTextDtoHttp
      | RequirementFileDtoHttp
    )[];
    const payment = JSON.parse(paymentRaw) as PaymentDtoHttp;

    const mappedRequirements = requirements.map((requirement, i) => {
      return requirement.textContent
        ? ({
            ...requirement,
            textContent: requirement.textContent,
            fileId: undefined,
          } as RequirementTextDto)
        : ({
            ...requirement,
            fileId: uploadedFiles[i]?.document?.id,
          } as RequirementFileDto);
    });

    return this.enrollService.makeStudentEnrollmentApplication({
      details: { ...details, studentId, schoolId },
      requirements: mappedRequirements,
      payment: {
        ...payment,
        fileId: uploadedFiles.at(-1)!.document?.id, // safer access than [length - 1]
      },
    });
  }
}
