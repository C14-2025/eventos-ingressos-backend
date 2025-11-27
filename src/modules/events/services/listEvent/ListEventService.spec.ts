import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { ListEventService } from './ListEventService';

let fakeEventsRepository: IEventsRepository;
let connection: Connection;
let listEventService: ListEventService;
let fakeCacheProvider: ICacheProvider;

describe('ListUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listEventService = new ListEventService(
      fakeEventsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('Should be able to list all the events', async (): Promise<void> => {
    const [event01, event02] = await fakeEventsRepository.createMany([
      {
        title: 'Test Event',
        date: '2025-09-20',
        time: '18:00',
      },
      {
        title: 'Test Event',
        date: '2025-09-20',
        time: '19:00',
      },
    ]);

    const userList = await listEventService.execute(1, 2, {});

    expect(userList.data).toEqual([event01, event02]);
  });

  it('Should be able to list all the users using cache', async (): Promise<void> => {
    const [event01, event02] = await fakeEventsRepository.createMany([
      {
        title: 'Test Event',
        date: '2025-09-20',
        time: '18:00',
      },
      {
        title: 'Test Event',
        date: '2025-09-20',
        time: '19:00',
      },
    ]);

    await listEventService.execute(1, 2, {});

    const userList = await listEventService.execute(1, 2, {});

    expect(userList.data).toEqual(
      JSON.parse(JSON.stringify([event01, event02])),
    );
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeEventsRepository, 'findAll').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_LIST', 'Failed to list events');
    });

    await expect(listEventService.execute(1, 2, {})).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
