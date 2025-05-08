import { Controller, UseGuards } from '@nestjs/common';
import { ReUploadService } from './re-upload.service';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('re-upload')
@UseGuards(JwtAuthGuard)
export class ReUploadController {
  constructor(private readonly reUploadService: ReUploadService) {}
}
