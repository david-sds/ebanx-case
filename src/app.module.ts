import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';
import { EventModule } from './event/event.module';
import { ResetModule } from './reset/reset.module';

@Module({
  imports: [BalanceModule, EventModule, ResetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
