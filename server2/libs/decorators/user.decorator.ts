import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthService } from '@lib/auth/auth.service';

type RequestUser = Awaited<ReturnType<AuthService['validateUserById']>>;

export const User = createParamDecorator(
  (data: keyof NonNullable<RequestUser> | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    // if you provide a specific key (e.g. @User('id')) return user.id
    return data ? user?.[data] : user;
  },
);
