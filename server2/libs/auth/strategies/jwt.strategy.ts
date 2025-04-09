import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || 'supersecret',
    });
  }

  async validate(payload: JwtPayload) {
    // You can fetch the user from the database or cache here
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // This will be added to the request object
  }
}
