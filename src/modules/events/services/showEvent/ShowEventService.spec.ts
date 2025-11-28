import { IConnection, Connection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { ShowEventService } from './ShowEventService';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { AppError } from '@shared/errors/AppError';

let connection: IConnection;
let showEventService: ShowEventService;
let fakeEventsRepository: IEventsRepository;

describe('ShowEventService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    showEventService = new ShowEventService(fakeEventsRepository, connection);
  });

  it('should be able to show an event', async (): Promise<void> => {
    const event = await fakeEventsRepository.create({
      title: 'Test Event',
      date: '2025-09-20',
      time: '18:00',
      capacity: 200,
    });

    const response = await showEventService.execute(event.id);

    expect(response.code).toBe(200);
    expect(response.message_code).toBe('FOUND');
    expect(response.data).toHaveProperty('id');
    expect(response.data.id).toBe(event.id);
    expect(response.data.title).toBe('Test Event');
  });

  it('should not be able to show an event with a non-existing id', async (): Promise<void> => {
    await expect(showEventService.execute('invalid-id')).rejects.toThrow(
      new AppError('NOT_FOUND', 'Event not found', 404),
    );
  });
});
