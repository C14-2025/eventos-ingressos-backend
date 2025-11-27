import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';

import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';

import { DeleteEventService } from './DeleteEventService';

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let deleteEventService: DeleteEventService;
let connection: IConnection;

describe('DeleteEventService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteEventService = new DeleteEventService(
      fakeEventsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('should delete an event successfully', async () => {
    const event = await fakeEventsRepository.create({
      title: 'Test Event',
      date: '2025-09-20',
      time: '18:00',
    });

    const response = await deleteEventService.execute(event.id);

    expect(response.code).toBe(204);
    expect(response.message_code).toBe('DELETED');

    const exists = await fakeEventsRepository.exists({
      where: { id: event.id },
    });
    expect(exists).toBeFalsy();
  });

  it('should throw an error if event does not exist', async () => {
    await expect(deleteEventService.execute('invalid-id')).rejects.toThrow(
      'Event not found',
    );
  });
});
