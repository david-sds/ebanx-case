import { IsIn, IsPositive, IsString } from 'class-validator';

export class DepositEventDto {
  @IsIn(['deposit'])
  type: 'deposit';

  @IsString()
  destination: string;

  @IsPositive()
  amount: number;
}

export class WithdrawEventDto {
  @IsIn(['withdraw'])
  type: 'withdraw';

  @IsString()
  origin: string;

  @IsPositive()
  amount: number;
}

export class TransferEventDto {
  @IsIn(['transfer'])
  type: 'transfer';

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsPositive()
  amount: number;
}
