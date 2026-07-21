import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountsRepository } from '../accounts/accounts.repository';

@Injectable()
export class BalanceService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  get(id: string): number {
    const account = this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException();
    }
    return account.balance;
  }
}
