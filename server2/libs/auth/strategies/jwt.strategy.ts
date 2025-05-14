import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request): string | null => {
        const token = req.cookies['access_token'];
        return typeof token === 'string' ? token : null;
      },
      secretOrKey: process.env.JWT_SECRET_KEY || 'supersecret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // This will be added to the request object
  }
}
