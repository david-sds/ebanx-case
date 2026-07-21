import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EventService } from './event.service';
import {
  DepositEventDto,
  TransferEventDto,
  WithdrawEventDto,
} from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    switch (body.type) {
      case 'deposit': {
        const dto = this.validate(DepositEventDto, body);
        return {
          destination: this.eventService.deposit(dto.destination, dto.amount),
        };
      }
      case 'withdraw': {
        const dto = this.validate(WithdrawEventDto, body);
        return { origin: this.eventService.withdraw(dto.origin, dto.amount) };
      }
      case 'transfer': {
        const dto = this.validate(TransferEventDto, body);
        return this.eventService.transfer(
          dto.origin,
          dto.destination,
          dto.amount,
        );
      }
      default:
        throw new BadRequestException(
          `Unknown event type: ${String(body.type)}`,
        );
    }
  }

  private validate<T extends object>(cls: new () => T, body: object): T {
    const instance = plainToInstance(cls, body);
    const errors = validateSync(instance);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.flatMap((error) => Object.values(error.constraints ?? {})),
      );
    }
    return instance;
  }
}
