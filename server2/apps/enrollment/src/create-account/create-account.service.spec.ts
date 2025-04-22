import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountService } from './create-account.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AuthService } from '@lib/auth/auth.service';

describe('CreateAccountService', () => {
  let service: CreateAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAccountService, PrismaService, AuthService],
    }).compile();

    service = module.get<CreateAccountService>(CreateAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
