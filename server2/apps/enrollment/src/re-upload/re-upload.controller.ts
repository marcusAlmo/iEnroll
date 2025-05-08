import { Controller } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';

@Controller()
export class ReUploadController {
  constructor(private readonly reUploadService: ReUploadService) {}
}
