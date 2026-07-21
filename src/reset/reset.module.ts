import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  controllers: [ResetController],
})
export class ResetModule {}
