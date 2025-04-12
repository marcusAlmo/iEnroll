// auth.controller.ts
import { SecureUtilityService } from '@lib/secure-utility/secure-utility.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

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
    if (!req.user.email) {
      // eslint-disable-next-line
      res.redirect(`http://localhost:5173/admin-credentials?e=${'not-found'}&v=false`);
      return;
    }

    // eslint-disable-next-line
    const encryptedEmail = SecureUtilityService.encrypt(req.user.email.toString());

    // eslint-disable-next-line
    res.redirect(`http://localhost:5173/admin-credentials?e=${encryptedEmail}&v=true`);
  }
}
