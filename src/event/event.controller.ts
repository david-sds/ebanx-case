import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    switch (body.type) {
      case 'deposit':
        this.assertString(body.destination, 'destination');
        this.assertPositiveNumber(body.amount, 'amount');
        return {
          destination: this.eventService.deposit(
            body.destination as string,
            body.amount as number,
          ),
        };
      case 'withdraw':
        this.assertString(body.origin, 'origin');
        this.assertPositiveNumber(body.amount, 'amount');
        return {
          origin: this.eventService.withdraw(
            body.origin as string,
            body.amount as number,
          ),
        };
      case 'transfer':
        this.assertString(body.origin, 'origin');
        this.assertString(body.destination, 'destination');
        this.assertPositiveNumber(body.amount, 'amount');
        return this.eventService.transfer(
          body.origin as string,
          body.destination as string,
          body.amount as number,
        );
      default:
        throw new BadRequestException(
          `Unknown event type: ${String(body.type)}`,
        );
    }
  }

  private assertString(value: unknown, field: string): void {
    if (typeof value !== 'string') {
      throw new BadRequestException(`${field} must be a string`);
    }
  }

  private assertPositiveNumber(value: unknown, field: string): void {
    if (typeof value !== 'number' || value <= 0) {
      throw new BadRequestException(`${field} must be a positive number`);
    }
  }
}
