import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';

@Controller('enroll')
@UseGuards(JwtAuthGuard)
export class EnrollController {}
