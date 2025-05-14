import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}
  public async login(payload: object): Promise<{ access_token: string }> {
    const token: { access_token: string } = await lastValueFrom(
      this.client.send({ cmd: 'login_acc' }, payload),
    );

    return token;
  }
}
