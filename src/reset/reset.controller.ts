import { Controller, HttpCode, Post } from '@nestjs/common';
import { AccountsRepository } from '../accounts/accounts.repository';

@Controller('reset')
export class ResetController {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  @Post()
  @HttpCode(200)
  reset(): void {
    this.accountsRepository.reset();
  }
}
