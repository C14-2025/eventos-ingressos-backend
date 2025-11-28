import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { FakeTicketsRepository } from '@modules/events/repositories/fakes/FakeTicketsRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';

import { SellTicketService } from './SellTicketService';
import { AppError } from '@shared/errors/AppError';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,qrcode_mock'),
}));

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let fakeTicketsRepository: ITicketsRepository;
let sellTicketService: SellTicketService;
let connection: IConnection;

describe('SellTicketService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeTicketsRepository = new FakeTicketsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    sellTicketService = new SellTicketService(
      fakeEventsRepository,
      fakeTicketsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('should be able to sell a ticket successfully', async (): Promise<void> => {
    const event = await fakeEventsRepository.create({
      title: 'My Event',
      date: '2025-10-10',
      time: '18:00',
      capacity: 100,
    });

    const ticketData = {
      event_id: event.id,
      document: '12345678900',
    };

    const response = await sellTicketService.execute(ticketData);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.qrCode).toContain('qrcode_mock');

    const allTickets = await fakeTicketsRepository.findAll({
      where: { event_id: event.id },
    });

    expect(allTickets.amount).toBe(1);
  });

  it('should not sell a ticket for a non-existing event', async () => {
    await expect(
      sellTicketService.execute({
        event_id: 'non-existing-event',
        document: '00011122233',
      }),
    ).rejects.toThrow(AppError);
  });

  it('should not sell a ticket if event capacity is exceeded', async () => {
    const event = await fakeEventsRepository.create({
      title: 'Full Event',
      date: '2025-12-01',
      time: '20:00',
      capacity: 1,
    });

    await sellTicketService.execute({
      event_id: event.id,
      document: '11111111111',
    });

    await expect(
      sellTicketService.execute({
        event_id: event.id,
        document: '22222222222',
      }),
    ).rejects.toThrow('No more tickets for this event');
  });

  it('should not sell two tickets to the same person for the same event', async () => {
    const event = await fakeEventsRepository.create({
      title: 'Unique Ticket Event',
      date: '2026-01-15',
      time: '19:30',
      capacity: 50,
    });

    const ticketData = {
      event_id: event.id,
      document: '55566677788',
    };

    await sellTicketService.execute(ticketData);

    await expect(sellTicketService.execute(ticketData)).rejects.toThrow(
      'Just one ticket per person',
    );
  });
});
