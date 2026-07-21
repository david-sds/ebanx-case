import { Injectable } from '@nestjs/common';

export interface Account {
  id: string;
  balance: number;
}

@Injectable()
export class AccountsRepository {
  private readonly accounts = new Map<string, Account>();

  findById(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  save(account: Account): Account {
    this.accounts.set(account.id, account);
    return account;
  }

  reset(): void {
    this.accounts.clear();
  }
}
