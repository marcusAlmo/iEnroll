import { Controller } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ReUploadController {
  constructor(private readonly reUploadService: ReUploadService) {}

  @MessagePattern({
    cmd: 'reupload_enrollment:get_all_requirements_for_reupload',
  })
  async getAllRequirementsForReupload(
    @Payload() payload: { studentId: number },
  ) {
    return await this.reUploadService.getAllRequirementsForReupload(
      payload.studentId,
    );
  }
}
