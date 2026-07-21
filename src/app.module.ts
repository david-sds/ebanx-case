import { Module } from '@nestjs/common';
import { BalanceModule } from './api/balance/balance.module';
import { EventModule } from './api/event/event.module';

@Module({
  imports: [BalanceModule, EventModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
