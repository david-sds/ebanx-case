import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  get(@Query('account_id') accountId: string): number {
    return this.balanceService.get(accountId);
  }
}
