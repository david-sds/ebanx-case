import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { AccountsRepository } from '../accounts/accounts.repository';

describe('EventService', () => {
  let service: EventService;
  let accountsRepository: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, AccountsRepository],
    }).compile();

    service = module.get<EventService>(EventService);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('creates the account with the deposited amount when it does not exist yet', () => {
      const result = service.deposit('100', 10);

      expect(result).toEqual({ id: '100', balance: 10 });
    });

    it('adds the amount to the existing balance', () => {
      service.deposit('100', 10);

      const result = service.deposit('100', 10);

      expect(result).toEqual({ id: '100', balance: 20 });
    });
  });

  describe('withdraw', () => {
    it('throws not found when the account does not exist', () => {
      expect(() => service.withdraw('200', 10)).toThrow(NotFoundException);
    });

    it('throws bad request when the balance is insufficient', () => {
      service.deposit('100', 10);

      expect(() => service.withdraw('100', 15)).toThrow(BadRequestException);
    });

    it('does not change the balance when the withdrawal fails', () => {
      service.deposit('100', 10);

      try {
        service.withdraw('100', 15);
      } catch {
        // expected: insufficient funds
      }

      expect(accountsRepository.findById('100')).toEqual({
        id: '100',
        balance: 10,
      });
    });

    it('subtracts the amount from the existing balance', () => {
      service.deposit('100', 10);

      const result = service.withdraw('100', 4);

      expect(result).toEqual({ id: '100', balance: 6 });
    });
  });

  describe('transfer', () => {
    it('throws not found when the origin account does not exist', () => {
      expect(() => service.transfer('200', '300', 10)).toThrow(
        NotFoundException,
      );
    });

    it('throws bad request when the origin balance is insufficient', () => {
      service.deposit('100', 10);

      expect(() => service.transfer('100', '300', 15)).toThrow(
        BadRequestException,
      );
    });

    it('does not create the destination account when the transfer fails', () => {
      service.deposit('100', 10);

      try {
        service.transfer('100', '300', 15);
      } catch {
        // expected: insufficient funds
      }

      expect(accountsRepository.findById('300')).toBeUndefined();
    });

    it('moves the amount from origin to destination', () => {
      service.deposit('100', 15);

      const result = service.transfer('100', '300', 15);

      expect(result).toEqual({
        origin: { id: '100', balance: 0 },
        destination: { id: '300', balance: 15 },
      });
    });
  });
});
