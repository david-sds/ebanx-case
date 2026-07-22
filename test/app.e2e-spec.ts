import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../src/app.module';
import { NotFoundExceptionFilter } from '../src/filters/not-found-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundExceptionFilter());
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await request(server).post('/reset').expect(200).expect('OK');
  });

  it('walks through the full deposit/withdraw/transfer flow', async () => {
    await request(server)
      .get('/balance?account_id=1234')
      .expect(404)
      .expect('0');

    await request(server)
      .post('/event')
      .send({ type: 'deposit', destination: '100', amount: 10 })
      .expect(201)
      .expect({ destination: { id: '100', balance: 10 } });

    await request(server)
      .post('/event')
      .send({ type: 'deposit', destination: '100', amount: 10 })
      .expect(201)
      .expect({ destination: { id: '100', balance: 20 } });

    await request(server)
      .get('/balance?account_id=100')
      .expect(200)
      .expect('20');

    await request(server)
      .post('/event')
      .send({ type: 'withdraw', origin: '200', amount: 10 })
      .expect(404)
      .expect('0');

    await request(server)
      .post('/event')
      .send({ type: 'withdraw', origin: '100', amount: 5 })
      .expect(201)
      .expect({ origin: { id: '100', balance: 15 } });

    await request(server)
      .post('/event')
      .send({ type: 'transfer', origin: '100', destination: '300', amount: 15 })
      .expect(201)
      .expect({
        origin: { id: '100', balance: 0 },
        destination: { id: '300', balance: 15 },
      });

    await request(server)
      .post('/event')
      .send({ type: 'transfer', origin: '200', destination: '300', amount: 15 })
      .expect(404)
      .expect('0');
  });

  it('rejects a withdrawal larger than the balance', async () => {
    await request(server)
      .post('/event')
      .send({ type: 'deposit', destination: '100', amount: 10 })
      .expect(201);

    await request(server)
      .post('/event')
      .send({ type: 'withdraw', origin: '100', amount: 999 })
      .expect(400);

    await request(server)
      .get('/balance?account_id=100')
      .expect(200)
      .expect('10');
  });

  it('rejects an unknown event type', async () => {
    await request(server)
      .post('/event')
      .send({ type: 'foo', destination: '100', amount: 10 })
      .expect(400);
  });
});
