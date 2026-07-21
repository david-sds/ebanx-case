import { Test, TestingModule } from '@nestjs/testing';
import { ResetController } from './reset.controller';
import { AccountsRepository } from '../accounts/accounts.repository';

describe('ResetController', () => {
  let controller: ResetController;
  let accountsRepository: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetController],
      providers: [AccountsRepository],
    }).compile();

    controller = module.get<ResetController>(ResetController);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('wipes all existing accounts', () => {
    accountsRepository.save({ id: '100', balance: 20 });

    controller.reset();

    expect(accountsRepository.findById('100')).toBeUndefined();
  });

  it('returns OK', () => {
    expect(controller.reset()).toBe('OK');
  });
});
