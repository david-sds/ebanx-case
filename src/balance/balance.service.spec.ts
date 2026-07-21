import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { AccountsRepository } from '../accounts/accounts.repository';

describe('BalanceService', () => {
  let service: BalanceService;
  let accountsRepository: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceService, AccountsRepository],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('throws not found when the account does not exist', () => {
      expect(() => service.get('1234')).toThrow(NotFoundException);
    });

    it('returns the balance of an existing account', () => {
      accountsRepository.save({ id: '100', balance: 20 });

      expect(service.get('100')).toBe(20);
    });
  });
});
