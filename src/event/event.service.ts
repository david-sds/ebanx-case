import { Account, AccountsRepository } from '../accounts/accounts.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  deposit(destination: string, amount: number): Account {
    const account = this.accountsRepository.findById(destination);
    const balance = (account?.balance ?? 0) + amount;
    return this.accountsRepository.save({ id: destination, balance });
  }

  withdraw(origin: string, amount: number): Account {
    const account = this.accountsRepository.findById(origin);
    if (!account) {
      throw new NotFoundException();
    }
    if (account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }
    return this.accountsRepository.save({
      id: origin,
      balance: account.balance - amount,
    });
  }

  transfer(
    origin: string,
    destination: string,
    amount: number,
  ): { origin: Account; destination: Account } {
    const originAccount = this.withdraw(origin, amount);
    const destinationAccount = this.deposit(destination, amount);
    return { origin: originAccount, destination: destinationAccount };
  }
}
