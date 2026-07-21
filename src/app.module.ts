import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';
import { EventModule } from './event/event.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [BalanceModule, EventModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
