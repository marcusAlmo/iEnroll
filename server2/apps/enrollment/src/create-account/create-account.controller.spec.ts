import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountController } from './create-account.controller';
import { CreateAccountService } from './create-account.service';

describe('CreateAccountController', () => {
  let controller: CreateAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        {
          provide: CreateAccountService,
          useValue: {
            createAccount: jest.fn().mockResolvedValue({}),
            getAccount: jest.fn().mockResolvedValue({}),
            updateAccount: jest.fn().mockResolvedValue({}),
            deleteAccount: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
