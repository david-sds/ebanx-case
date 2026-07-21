import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Account, AccountsRepository } from '../accounts/accounts.repository';

@Injectable()
export class EventService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  deposit(destination: string, amount: number): Account {
    const account = this.accountsRepository.findById(destination);
    const balance = (account?.balance ?? 0) + amount;
    return this.accountsRepository.save({ id: destination, balance });
  }
}
