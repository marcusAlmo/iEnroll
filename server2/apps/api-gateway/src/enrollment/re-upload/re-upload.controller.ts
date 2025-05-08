import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { User } from '@lib/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EnrollService } from '../enroll/enroll.service';
import { ReuploadRequirementDto } from '@lib/dtos/src/enrollment/v1/re-upload.dto';
@Controller('re-upload')
@UseGuards(JwtAuthGuard)
export class ReUploadController {
  constructor(
    private readonly reUploadService: ReUploadService,
    private readonly enrollService: EnrollService,
  ) {}

  @Get()
  async getAllRequirementsForReupload(@User('user_id') studentId: number) {
    return this.reUploadService.getAllRequirementsForReupload(studentId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async resubmitInvalidRequirements(
    @User('user_id') studentId: number,
    @User('school_id') schoolId: number,
    @Body()
    resubmitInvalidRequirementsDto: ReuploadRequirementDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const requirements = JSON.parse(
      resubmitInvalidRequirementsDto.requirements,
    ) as {
      requirementId: number;
      textContent?: string;
    }[];

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

    const mappedRequirements = requirements.map((requirement, i) => {
      return requirement.textContent
        ? {
            ...requirement,
            textContent: requirement.textContent,
            fileId: undefined,
          }
        : {
            ...requirement,
            fileId: uploadedFiles[i]?.document?.id,
          };
    });

    return this.reUploadService.resubmitInvalidRequirements({
      details: {
        studentId,
      },
      requirements: mappedRequirements,
    });
  }
}
