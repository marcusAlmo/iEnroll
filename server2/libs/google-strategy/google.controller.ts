// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SecureUtilityService } from '../secure-utility/secure-utility.service';
@Controller('auth')
export class GoogleAuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Starts Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    if (!req.user || !req.user.email)
      res.redirect(`http://localhost:5174/admin-credentials`);

    const encryptedEmail = SecureUtilityService.encrypt(req.user.email);

    res.redirect(
      `http://localhost:5174/admin-credentials?e=${encryptedEmail}&v=true`,
    );
  }
}
