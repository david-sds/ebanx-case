import { CreateEventDto } from './dto/create-event.dto';
import { Account, AccountsRepository } from '../accounts/accounts.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  create(createEventDto: CreateEventDto) {
    return `This action adds a new event ${JSON.stringify(createEventDto)}`;
  }

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
}
