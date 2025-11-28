import { IConnection, Connection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { ShowTicketService } from './ShowTicketService';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { FakeTicketsRepository } from '@modules/events/repositories/fakes/FakeTicketsRepository';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,qrcode_mock'),
}));

let connection: IConnection;
let showTicketService: ShowTicketService;
let fakeTicketsRepository: ITicketsRepository;

describe('ShowTicketService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeTicketsRepository = new FakeTicketsRepository();
    showTicketService = new ShowTicketService(fakeTicketsRepository, connection);
  });

  it('should be able to show a ticket list for a document', async (): Promise<void> => {
    await fakeTicketsRepository.create({
      document: '12345678900',
      event_id: 'event-123',
    });

    const response = await showTicketService.execute('12345678900');

    expect(response.code).toBe(200);
    expect(response.message_code).toBe('LISTED');
    expect(response.data.length).toBe(1);
    expect(response.data[0]).toHaveProperty('qrCode');
    expect(response.data[0].qrCode).toContain('qrcode_mock');
    expect(response.pagination.total).toBe(1);
  });

  it('should return empty list if document has no tickets', async (): Promise<void> => {
    const response = await showTicketService.execute('no-ticket-document');

    expect(response.code).toBe(200);
    expect(response.data.length).toBe(0);
    expect(response.pagination.total).toBe(0);
    expect(response.pagination.perPage).toBe(0);
  });

  it('should list multiple tickets with QRCode for one document', async (): Promise<void> => {
    await fakeTicketsRepository.create({
      document: 'abc123',
      event_id: 'e1',
    });

    await fakeTicketsRepository.create({
      document: 'abc123',
      event_id: 'e2',
    });

    const response = await showTicketService.execute('abc123');

    expect(response.code).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.pagination.total).toBe(2);

    response.data.forEach(ticket => {
      expect(ticket.qrCode).toContain('qrcode_mock');
    });
  });

});
