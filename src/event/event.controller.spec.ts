import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { AccountsRepository } from '../accounts/accounts.repository';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [EventService, AccountsRepository],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('creates the account with the deposited amount', () => {
      const result = controller.create({
        type: 'deposit',
        destination: '100',
        amount: 10,
      });

      expect(result).toEqual({ destination: { id: '100', balance: 10 } });
    });

    it('throws bad request when destination is missing', () => {
      expect(() => controller.create({ type: 'deposit', amount: 10 })).toThrow(
        BadRequestException,
      );
    });
  });

  describe('withdraw', () => {
    it('subtracts the amount from the existing balance', () => {
      controller.create({
        type: 'deposit',
        destination: '100',
        amount: 10,
      });

      const result = controller.create({
        type: 'withdraw',
        origin: '100',
        amount: 4,
      });

      expect(result).toEqual({ origin: { id: '100', balance: 6 } });
    });

    it('throws bad request when origin is missing', () => {
      expect(() => controller.create({ type: 'withdraw', amount: 10 })).toThrow(
        BadRequestException,
      );
    });

    it('throws not found when the origin account does not exist', () => {
      expect(() =>
        controller.create({
          type: 'withdraw',
          origin: '999',
          amount: 10,
        }),
      ).toThrow(NotFoundException);
    });
  });

  describe('transfer', () => {
    it('moves the amount from origin to destination', () => {
      controller.create({
        type: 'deposit',
        destination: '100',
        amount: 15,
      });

      const result = controller.create({
        type: 'transfer',
        origin: '100',
        destination: '300',
        amount: 15,
      });

      expect(result).toEqual({
        origin: { id: '100', balance: 0 },
        destination: { id: '300', balance: 15 },
      });
    });

    it('throws bad request when destination is missing', () => {
      expect(() =>
        controller.create({
          type: 'transfer',
          origin: '100',
          amount: 10,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('unknown event type', () => {
    it('throws bad request', () => {
      expect(() => controller.create({ type: 'foo' })).toThrow(
        BadRequestException,
      );
    });
  });
});
