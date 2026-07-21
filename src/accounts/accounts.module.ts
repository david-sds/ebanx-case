import { Module } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';

@Module({
  providers: [AccountsRepository],
  exports: [AccountsRepository],
})
export class AccountsModule {}
