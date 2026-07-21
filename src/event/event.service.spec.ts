import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { AccountsRepository } from '../accounts/accounts.repository';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, AccountsRepository],
    }).compile();

    service = module.get<EventService>(EventService);
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
});
